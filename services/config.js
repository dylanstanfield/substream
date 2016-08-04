// libraries
var comb = require('comb');

// services
var Drive = require('./drive');

// logger
var logger = comb.logger('ss.services.config');

class ConfigService {

    static getConfig(auth) {
        return new Promise((resolve, reject) => {

            let configFileId = null;

            Drive.getAppDataFiles(auth).then((files) => {

                files.forEach(function(file) {
                    if(file.name == "config.json") configFileId = file.id;
                });

                if(configFileId) {
                    return Drive.getFile(configFileId, auth);
                } else {
                    return this.createConfig(auth).then(newFileId => {
                        configFileId = newFileId;
                        return Drive.getFile(configFileId, auth);
                    });
                }
            }).then((data) => {
                resolve({
                    id: configFileId,
                    data: data
                });
            }).catch((err) => {
                reject(err);
            });
        });
    }

    static createConfig(auth) {
        var metadata = {
            'name': 'config.json',
            'parents': [ 'appDataFolder']
        };

        var config = {};
        config.test = 'this is a test';
        config.version = 1;

        var media = {
            mimeType: 'application/json',
            body: JSON.stringify(config)
        };

        return Drive.createFile(metadata, media, auth);
    }

    static saveConfig(config, auth) {
        return new Promise((resolve, reject) => {
            Drive.updateFile(config.id, config.data, auth).then(fileId => {
                resolve(fileId);
            }).catch(err => {
                reject(err);
            });
        });
    }

}

module.exports = ConfigService;