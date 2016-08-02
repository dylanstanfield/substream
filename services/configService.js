var google = require('googleapis');

class ConfigService {

    constructor() {
        this.drive = google.drive('v3');
    }

    getConfig(auth) {
        return new Promise((resolve, reject) => {
            this.getAppDataFiles(auth).then((files) => {

                var configFileId = null;

                files.forEach(function(file) {
                    if(file.name == "config.json") configFileId = file.id;
                });

                if(configFileId) {
                    this.getFile(configFileId, auth).then((file) => {
                        resolve({
                            id: configFileId,
                            data: file
                        });
                    });
                } else {
                    this.createConfigFile(auth).then((fileId) => {
                        this.getFile(fileId, auth).then((file) => {
                            resolve({
                                id: fileId,
                                data: file
                            });
                        });
                    });
                }
            });
        });
    }

    updatedConfig(config, configFileId, auth) {
        return new Promise((resolve, reject) => {
            this.drive.files.update(
                {
                    fileId: configFileId,
                    uploadType: 'media',
                    media: {
                        mimeType: 'application/json',
                        body: JSON.stringify(config)
                    },
                    auth: auth
                },
                function(err, response) {
                    if(err) reject(reject);
                    else resolve(response.id)
                }
            );
        });
    }

    getAppDataFiles(auth) {
        return new Promise((resolve, reject) => {
            this.drive.files.list(
                {
                    spaces: 'appDataFolder',
                    fields: 'nextPageToken, files(id, name)',
                    pageSize: 100,
                    auth: auth
                },
                function(err, response) {
                    if(err) reject(reject);
                    else resolve(response.files)
                }
            );
        });

    }

    createConfigFile(auth) {

        var fileMetadata = {
            'name': 'config.json',
            'parents': [ 'appDataFolder']
        };

        var config = {};
        config.test = 'this is a test';

        var media = {
            mimeType: 'application/json',
            body: JSON.stringify(config)
        };

        return new Promise((resolve, reject) => {
            this.drive.files.create(
                {
                    resource: fileMetadata,
                    media: media,
                    fields: 'id',
                    auth: auth
                },
                function(err, response) {
                    if(err) reject(reject);
                    else resolve(response.id)
                }
            );
        });
    }

    getFile(fileId, auth) {
        return new Promise((resolve, reject) => {
            this.drive.files.get(
                {
                    fileId: fileId,
                    alt: 'media',
                    auth: auth
                },
                function(err, response) {
                    if(err) reject(reject);
                    else resolve(response);
                }
            );
        });
    }
}

module.exports = ConfigService;