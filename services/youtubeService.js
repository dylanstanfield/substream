var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var auth = require('./../config/auth');

var oauth2Client = new OAuth2(
    auth.googleAuth.clientID,
    auth.googleAuth.clientSecret,
    auth.googleAuth.callbackURL);

var scopes = [ 'https://www.googleapis.com/auth/youtube', 'https://www.googleapis.com/auth/drive.appdata' ];

var YouTube = google.youtube({ version: 'v3', auth: oauth2Client });
var Drive = google.drive({ version: 'v3', auth: oauth2Client });

var configFileId = null;

class YouTubeService {
    constructor() {
        this.authUrl =  oauth2Client.generateAuthUrl({
            access_type: 'offline', // 'online' (default) or 'offline' (gets refresh_token)
            scope: scopes // If you only need one scope you can pass it as string
        });
    }

    setTokenForCode(code) {
        return new Promise((resolve, reject) => {
            oauth2Client.getToken(code, function(err, tokens) {
                // Now tokens contains an access_token and an optional refresh_token. Save them.
                if (err) reject(err);
                else {
                    resolve(oauth2Client.setCredentials(tokens));
                }
            });
        });
    }

    getSubscriptionList() {
        return new Promise((resolve, reject) => {
            YouTube.subscriptions.list(
                {
                    part: 'snippet',
                    mine: true,
                    maxResults: 50
                },
                function(err, response) {
                    if(err) reject(err);
                    else resolve(response.items);
                }
            );
        });
    }

    getCurrentUserInfo() {
        return new Promise((resolve, reject) => {
            YouTube.channels.list(
                {
                    part: 'snippet',
                    mine: true

                },
                function(err, response) {
                    if(err) reject(err);
                    else resolve(response.items[0].snippet);
                }
            );
        });
    }

    getConfig() {
        return new Promise((resolve, reject) => {
            this.getAppDataFiles().then((files) => {

                files.forEach(function(file) {
                    if(file.name == "config.json") configFileId = file.id;
                });

                if(configFileId) {
                    this.getFile(configFileId).then((file) => {
                        resolve(file);
                    });
                } else {
                    this.createConfigFile().then((fileId) => {
                        this.getFile(fileId).then((file) => {
                            resolve(file);
                        });
                    });
                }
            });
        });
    }

    updatedConfig(config) {
        return new Promise((resolve, reject) => {
            Drive.files.update(
                {
                    fileId: configFileId,
                    uploadType: 'media',
                    media: {
                        mimeType: 'application/json',
                        body: JSON.stringify(config)
                    }
                },
                function(err, response) {
                    if(err) reject(reject);
                    else resolve(response.id)
                }
            );
        });
    }

    getAppDataFiles() {
        return new Promise((resolve, reject) => {
            Drive.files.list(
                {
                    spaces: 'appDataFolder',
                    fields: 'nextPageToken, files(id, name)',
                    pageSize: 100
                },
                function(err, response) {
                    if(err) reject(reject);
                    else resolve(response.files)
                }
            );
        });

    }

    createConfigFile() {

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
            Drive.files.create(
                {
                    resource: fileMetadata,
                    media: media,
                    fields: 'id'
                },
                function(err, response) {
                    if(err) reject(reject);
                    else resolve(response.id)
                }
            );
        });
    }

    getFile(fileId) {
        return new Promise((resolve, reject) => {
            Drive.files.get(
                {
                    fileId: fileId,
                    alt: 'media'
                },
                function(err, response) {
                    if(err) reject(reject);
                    else resolve(response);
                }
            );
        });
    }
}

module.exports = YouTubeService;