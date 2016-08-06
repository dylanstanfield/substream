// libraries
var google = require('googleapis');
var YouTube = google.youtube('v3');
var comb = require('comb');

// logger
var logger = comb.logger('ss.services.youtube');

class YouTubeService {

    /**
     * Get's subscriptions for a user
     * @param auth
     * @returns {Promise} resolves to a list of subscriptions
     */
    static getSubscriptions(auth) {
        logger.debug(`Getting subscriptions...`);

        return new Promise((resolve, reject) => {
            YouTube.subscriptions.list(
                {
                    part: 'snippet',
                    mine: true,
                    maxResults: 50,
                    auth: auth
                },
                function(err, response) {
                    if(err){
                        logger.error(`Failed to get subscriptions`, err);
                        reject(err);
                    } else {
                        logger.debug(`Successfully got subscriptions`);
                        resolve(response.items);
                    }
                }
            );
        });
    }

    /**
     * Get's the user's channel data
     * @param auth
     * @returns {Promise} that resolves to the user's information
     */
    static getUserInfo(auth) {
        logger.debug(`Getting user info...`);

        return new Promise((resolve, reject) => {
            YouTube.channels.list(
                {
                    part: 'snippet',
                    mine: true,
                    auth: auth

                },
                function(err, response) {
                    if(err) {
                        logger.error(`Failed to get user info`, err);
                        reject(err);
                    } else {
                        logger.debug(`Successfully got user info`);
                        resolve(response.items[0].snippet);
                    }
                }
            );
        });
    }

    /**
     * Gets videos for a channel - sorted by most recent
     * @param auth
     * @param channelId
     * @returns {Promise}
     */
    static getVideos(auth, channelId) {
        logger.debug(`Getting videos for ${channelId}...`);

        return new Promise((resolve, reject) => {
            YouTube.search.list(
                {
                    part: 'snippet',
                    type: 'video',
                    channelId: channelId,
                    maxResults: 50,
                    order: 'date',
                    auth: auth
                },
                function(err, response) {
                    if(err) {
                        logger.error(`Failed to get videos for ${channelId}`, err);
                        reject(err);
                    } else {
                        logger.debug(`Successfully got videos for ${channelId}`);
                        resolve(response.items);
                    }
                }
            );
        });
    }
}

module.exports = YouTubeService;