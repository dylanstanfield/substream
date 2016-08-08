// libraries
var comb = require('comb');
var moment = require('moment');

// services
var YouTube = require('./../services/youtube');
var Config = require('./../services/config');

// helpers
var OAuth2Helper = require('./../helpers/oauth2');
let FoldersHelper = require('./../helpers/folders');

// models
let ConfigData = require('./../models/configData');
let Folder = require('./../models/folder');

var logger = comb.logger('ss.controllers.streams');

class StreamsController {

    /**
     * Gets all streams for a user
     * @param user
     * @param subs
     * @returns {Promise}
     */
    static getAllStreams(user, subs) {
        logger.debug(`Attempting to get all user's streams...`);

        return new Promise((resolve, reject) => {
            FoldersHelper.buildFolderVMs(subs, ConfigData.fromJson(user.config.data)).then(folderVMs => {
                logger.debug(`Successfully got all user's streams`);
                resolve(folderVMs);
            }).catch((err) => {
                logger.error(`Failed to get all user's streams - ${err.message}`);
                reject(err);
            });
        });
    }

    /**
     * Gets a stream for a folderId
     * @param user
     * @param subs
     * @param folderId
     * @returns {Promise.<T>}
     */
    static getStream(user, subs, folderId) {
        logger.debug(`Attempting to get user's stream...`);

        return new Promise((resolve, reject) => {
            FoldersHelper.buildFolderVM(subs, ConfigData.fromJson(user.config.data), folderId).then(folderVM => {
                logger.debug(`Successfully got user's stream`);
                resolve(folderVM);
            });
        }).catch((err) => {
            logger.error(`Failed to get user's stream - ${err.message}`);
            reject(err);
        });
    }

    /**
     * Creates a stream for a user
     * @param user
     * @param name
     * @param subIds
     * @returns {Promise}
     */
    static createStream(user, name, subIds) {
        logger.debug(`Attempting to create stream...`);

        return new Promise((resolve, reject) => {
            let folder = new Folder();
            folder.name = name;
            folder.subIds = subIds;

            let configData = ConfigData.fromJson(user.config.data);
            configData.addFolder(folder);

            let $auth = null;

            OAuth2Helper.getAuth(user.creds).then(auth => {
                $auth = auth;
                return Config.saveConfig(user.config.id, configData, auth);
            }).then(() => {
                return Config.getConfig($auth);
            }).then((config) => {
                user.config = config;
                logger.debug(`Successfully created stream`);
                resolve(folder.id);
            }).catch(err => {
                logger.error(`Failed to create stream - ${err.message}`);
                reject(err);
            });
        });
    }

    /**
     * Deletes a users stream by id
     * @param user
     * @param folderId
     * @returns {Promise}
     */
    static deleteStream(user, folderId) {
        logger.debug(`Attempting to delete stream...`);

        let configData = ConfigData.fromJson(user.config.data);
        let $auth = null;

        return new Promise((resolve, reject) => {
            OAuth2Helper.getAuth(user.creds).then(auth => {
                $auth = auth;
                return configData.deleteFolderById(folderId);
            }).then(() => {
                return Config.saveConfig(user.config.id, configData, $auth);
            }).then(() => {
                return Config.getConfig($auth);
            }).then((config) => {
                user.config = config;
                logger.debug(`Successfully deleted stream`);
                resolve();
            }).catch(err => {
                logger.error(`Failed to delete stream - ${err.message}`);
                reject(err);
            });
        })
    }

    /**
     * Replaces the subIds for a folder from a list of subs
     * @param user
     * @param folderId
     * @param subs
     * @returns {Promise}
     */
    static updateStream(user, folderId, subs) {
        logger.debug(`Attempting to update stream...`);

        let configData = ConfigData.fromJson(user.config.data);
        let $auth = null;

        return new Promise((resolve, reject) => {
            OAuth2Helper.getAuth(user.creds).then(auth => {
                $auth = auth;
                return FoldersHelper.getSubIds(subs);
            }).then(subIds => {
                return configData.setSubIdsForId(folderId, subIds);
            }).then(() => {
                return Config.saveConfig(user.config.id, configData, $auth);
            }).then(() => {
                return Config.getConfig($auth);
            }).then((config) => {
                user.config = config;
                logger.debug(`Successfully updated stream`);
                resolve();
            }).catch(err => {
                logger.error(`Failed to update stream - ${err.message}`);
                reject(err);
            });
        });
    }

    /**
     * Gets all user's subscriptions
     * @param user
     * @returns {Promise}
     */
    static getAllSubs(user) {
        logger.debug(`Attempting to get all subs...`);

        return new Promise((resolve, reject) => {
            OAuth2Helper.getAuth(user.creds).then(auth => {
                return YouTube.getSubscriptions(auth);
            }).then(subs => {
                logger.debug(`Successfully got all subs`);
                resolve(subs);
            }).catch(err => {
                logger.error(`Failed to get all subs - ${err.message}`);
                reject(err);
            })
        });
    }

    /**
     * Gets recent videos for a stream
     * @param user
     * @param folderId
     * @returns {Promise}
     */
    static getVideos(user, folderId) {
        logger.debug(`Attempting to get videos for stream...`);

        return new Promise((resolve, reject) => {
            let $auth = null;

            OAuth2Helper.getAuth(user.creds).then(auth => {
                $auth = auth;
                return FoldersHelper.getFolderById(user.config.data, folderId);
            }).then(folder => {
                let videoCalls = [];

                for(let subId of folder.subIds) {
                    videoCalls.push(YouTube.getVideos($auth, subId));
                }

                return Promise.all(videoCalls);
            }).then(results => {
                logger.debug(`Successfully got videos for stream`);

                let videos = [];

                for(let set of results) {
                    for(let video of set) {
                        videos.push(video);
                    }
                }

                videos.sort(sortByPublishedTime);

                resolve(videos);
            }).catch(err => {
                logger.error(`Failed to get videos for stream - ${err.message}`);
                reject(err);
            })
        });
    }
}

function sortByPublishedTime(a,b) {
    let aMilli = moment(a.snippet.publishedAt, "YYYY-MM-DDTHH:mm:ssZ").unix();
    let bMilli = moment(b.snippet.publishedAt, "YYYY-MM-DDTHH:mm:ssZ").unix();
    if(aMilli < bMilli) return 1;
    if(aMilli > bMilli) return -1;
    return 0;
}

module.exports = StreamsController;