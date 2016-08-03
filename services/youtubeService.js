var google = require('googleapis');

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