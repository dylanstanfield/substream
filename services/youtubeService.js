var google = require('googleapis');
var YouTube = google.youtube('v3');

class YouTubeService {

    static getSubscriptions(auth) {
        return new Promise((resolve, reject) => {
            YouTube.subscriptions.list(
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

    static getUserInfo(auth) {
        return new Promise((resolve, reject) => {
            YouTube.channels.list(
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