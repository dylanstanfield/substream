var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var auth = require('./../config/auth');

var oauth2Client = new OAuth2(
    auth.googleAuth.clientID,
    auth.googleAuth.clientSecret,
    auth.googleAuth.callbackURL);

var scopes = [ "https://www.googleapis.com/auth/youtube" ];

var YouTube = google.youtube({ version: 'v3', auth: oauth2Client });

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
}

module.exports = YouTubeService;