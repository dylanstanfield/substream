// libraries
var comb = require('comb');

// services
var Drive = require('./drive');

// models
var ConfigData = require('./../models/configData');

// logger
var logger = comb.logger('ss.services.config');

class ConfigService {

    /**
     * Gets or creates a config file for a user
     * @param auth
     * @returns {Promise} which resolves to an object with a config's file id and data
     */
    static getConfig(auth) {
        logger.debug(`Attempting to get config file data...`);
        return new Promise((resolve, reject) => {
            let configFileId = null;

            Drive.getAppDataFiles(auth).then((files) => {
                logger.debug(`Searching through appdata metadata for config file...`);
                for(let file of files) {
                    if(file.name == "config.json") {
                        logger.debug(`Found config file metadata`);
                        configFileId = file.id;
                    }
                }

                if(configFileId) {
                    return Drive.getFile(configFileId, auth);
                } else {
                    logger.debug(`No config file found...`);
                    return this.createConfig(auth).then(newFileId => {
                        configFileId = newFileId;
                        logger.debug(`Getting newly created file...`);
                        return Drive.getFile(configFileId, auth);
                    });
                }
            }).then((data) => {
                logger.debug(`Successfully got config file data`);
                resolve({
                    id: configFileId,
                    data: data
                });
            }).catch((err) => {
                logger.error(`Failed to get config file - ${err.message}`);
                reject(err);
            });
        });
    }

    /**
     * Creates a config file for a user
     * @param auth
     * @returns {Promise} which resolves to a promise from Drive's create file service
     */
    static createConfig(auth) {
        logger.debug(`Attempting to create config file...`);

        var metadata = {
            'name': 'config.json',
            'parents': [ 'appDataFolder']
        };

        var configData = new ConfigData();
        configData.lastSaved = new Date();

        var media = {
            mimeType: 'application/json',
            body: JSON.stringify(configData)
        };

        return Drive.createFile(metadata, media, auth);
    }

    /**
     * Saves a user's config data
     * @param configId
     * @param configData
     * @param auth
     * @returns {Promise} which resolves to the file id of the saved file
     */
    static saveConfig(configId, configData, auth) {
        logger.debug(`Attempting to save config file...`);
        return new Promise((resolve, reject) => {
            Drive.updateFile(configId, configData, auth).then(fileId => {
                logger.debug(`Successfully saved config file ${fileId}`);
                resolve(fileId);
            }).catch(err => {
                logger.error(`Failed to save config file - ${err.message}`);
                reject(err);
            });
        });
    }

}

module.exports = ConfigService;