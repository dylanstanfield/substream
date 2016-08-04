// libraries
var comb = require('comb');
var google = require('googleapis');
var Drive = google.drive('v3');

// logger
var logger = comb.logger('ss.services.drive');

class DriveService {

    static updateFile(fileId, data, auth) {
        return new Promise((resolve, reject) => {
            Drive.files.update(
                {
                    fileId: fileId,
                    uploadType: 'media',
                    media: {
                        mimeType: 'application/json',
                        body: JSON.stringify(data)
                    },
                    auth: auth
                },
                function(err, response) {
                    if(err) reject(reject);
                    else resolve(response.id);
                }
            );
        });
    }

    static getAppDataFiles(auth) {
        logger.info(`Trying to get appdata files for ${auth.access_token}`);
        return new Promise((resolve, reject) => {
            Drive.files.list(
                {
                    spaces: 'appDataFolder',
                    fields: 'nextPageToken, files(id, name)',
                    pageSize: 100,
                    auth: auth
                },
                function(err, response) {
                    if(err) {
                        logger.error(`Failed to get appdata files for ${auth.access_token} - ${err.message}`);
                        reject(err);
                    }
                    else {
                        logger.info(`Successfully got appdata files for ${auth.access_token}`);
                        resolve(response.files)
                    }
                }
            );
        });

    }

    static getFile(fileId, auth) {
        logger.info(`Trying to get file (${fileId}) for ${auth.access_token}`);
        return new Promise((resolve, reject) => {
            Drive.files.get(
                {
                    fileId: fileId,
                    alt: 'media',
                    auth: auth
                },
                function(err, data) {
                    if(err) {
                        logger.error(`Failed to get file (${fileId}) for ${auth.access_token} - ${err.message}`);
                        reject(reject);
                    } else {
                        logger.info(`Successfully got file (${fileId}) for ${auth.access_token}`);
                        resolve(data);
                    }
                }
            );
        });
    }

    static createFile(metadata, media, auth) {
        logger.info(`Trying to create file (${metadata.name}) for ${auth.access_token}`);
        return new Promise((resolve, reject) => {
            Drive.files.create(
                {
                    resource: metadata,
                    media: media,
                    fields: 'id',
                    auth: auth
                },
                function(err, response) {
                    if(err) {
                        logger.error(`Failed to create file (${metadata.name}) for ${auth.access_token} - ${err.message}`);
                        reject(err);
                    } else {
                        logger.info(`Successfully created file (${metadata.name}) for ${auth.access_token} - file id: ${response.id}`);
                        resolve(response.id);
                    }
                }
            );
        });
    }
}

module.exports = DriveService;