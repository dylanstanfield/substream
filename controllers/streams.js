var comb = require('comb');
var logger = comb.logger('ss.controllers.streams');

var YouTube = require('./../services/youtube');
var Config = require('./../services/config');
var OAuth2Helper = require('./../helpers/oauth2');

let FoldersHelper = require('./../helpers/folders');
let ConfigData = require('./../models/configData');

let Folder = require('./../models/folder');

class StreamsController {

    static getAllStreams(user, subs) {
        return new Promise((resolve, reject) => {
            FoldersHelper.buildFolderVMs(subs, ConfigData.fromJson(user.config.data)).then(folderVMs => {
                resolve(folderVMs);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    static getStream(user, subs, folderId) {
        return new Promise((resolve, reject) => {
            FoldersHelper.buildFolderVM(subs, ConfigData.fromJson(user.config.data), folderId).then(folderVM => {
                resolve(folderVM);
            });
        }).catch((err) => {
            reject(err);
        });
    }

    static createStream(user, name, subIds) {

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
                resolve(folder.id);
            }).catch(err => {
                reject(err);
            });
        });
    }

    static deleteStream(user, folderId) {

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
                resolve();
            }).catch(err => {
                reject(err);
            });
        })
    }

    static getAllSubs(user) {
        return new Promise((resolve, reject) => {
            OAuth2Helper.getAuth(user.creds).then(auth => {
                return YouTube.getSubscriptions(auth);
            }).then(subs => {
                resolve(subs);
            }).catch(err => {
                reject(err);
            })
        });
    }
}

module.exports = StreamsController;