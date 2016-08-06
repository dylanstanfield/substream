// libraries
var comb = require('comb');
var google = require('googleapis');
var Drive = google.drive('v3');

// logger
var logger = comb.logger('ss.services.drive');

class DriveService {

    /**
     * Sends a request to update a file on a user's Google Drive
     * @param fileId
     * @param data
     * @param auth
     * @returns {Promise} which resolves to the file's id
     */
    static updateFile(fileId, data, auth) {
        logger.debug(`Updating file...`);

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
                    if(err) {
                        logger.error(`Failed to update`, err);
                        reject(new Error(err));
                    } else {
                        logger.debug(`Successfully updated file`);
                        resolve(response.id);
                    }
                }
            );
        });
    }

    /**
     * Gets all the files in the hidden AppData folder for this application on a user's Google Drive
     * @param auth
     * @returns {Promise}
     */
    static getAppDataFiles(auth) {
        logger.debug(`Getting metadata for appdata files...`);

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
                        logger.error(`Failed to get metadata for appdata files`, err);
                        reject(err);
                    }
                    else {
                        logger.debug(`Successfully got metadata for appdata file`);
                        resolve(response.files)
                    }
                }
            );
        });

    }

    /**
     * Gets a file's contents by it's file id from a user's Google Drive
     * @param fileId
     * @param auth
     * @returns {Promise} which resolves to a file's contents
     */
    static getFile(fileId, auth) {
        logger.debug(`Getting file data...`);

        return new Promise((resolve, reject) => {
            Drive.files.get(
                {
                    fileId: fileId,
                    alt: 'media',
                    auth: auth
                },
                function(err, data) {
                    if(err) {
                        logger.error(`Failed to get file data`, err);
                        reject(reject);
                    } else {
                        logger.debug(`Successfully got file data`);
                        resolve(data);
                    }
                }
            );
        });
    }

    /**
     * Creates a file on a user's Google Drive
     * @param metadata
     * @param media
     * @param auth
     * @returns {Promise} which resolves as the new file's id
     */
    static createFile(metadata, media, auth) {
        logger.debug(`Creating file...`);

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
                        logger.error(`Failed to create file`, err);
                        reject(err);
                    } else {
                        logger.debug(`Successfully created file`);
                        resolve(response.id);
                    }
                }
            );
        });
    }

}

module.exports = DriveService;