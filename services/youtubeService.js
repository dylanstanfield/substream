var google = require('googleapis');

// var oauth2Client = new OAuth2(
//     auth.googleAuth.clientID,
//     auth.googleAuth.clientSecret,
//     auth.googleAuth.callbackURL);

// var scopes = [ 'https://www.googleapis.com/auth/youtube', 'https://www.googleapis.com/auth/drive.appdata' ];


class YouTubeService {
    constructor() {
        this.youtube = google.youtube('v3');
    }

    getSubscriptionList(auth) {
        return new Promise((resolve, reject) => {
            this.youtube.subscriptions.list(
                {
                    part: 'snippet',
                    mine: true,
                    maxResults: 50,
                    auth: auth
                },
                function(err, response) {
                    if(err) reject(err);
                    else resolve(response.items);
                }
            );
        });
    }

    getCurrentUserInfo(auth) {
        return new Promise((resolve, reject) => {
            this.youtube.channels.list(
                {
                    part: 'snippet',
                    mine: true,
                    auth: auth

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