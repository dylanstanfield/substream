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
            getSubscriptions(auth).then(subs => { // private method for handling pagination from YouTube
                logger.debug(`Successfully got subscriptions`);
                resolve(subs);
            }).catch(err => {
                logger.error(`Failed to get subscriptions in get next page - ${err.message}`, err);
                reject(err);
            });
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
            getVideos(auth, channelId).then(videos => {
                resolve(videos);
            }).catch(err => {
                logger.error(`Failed to get videos - ${err.message}`);
                reject(err);
            });
        });
    }
}

function getSubscriptions(auth, subs, nextPageToken) {
    if(nextPageToken || subs == undefined) { // subs is undefined on first time through
        return new Promise((resolve, reject) => {
            let params = {
                part: 'snippet',
                mine: true,
                maxResults: 50,
                auth: auth
            };

            if(nextPageToken) params.pageToken = nextPageToken; // if there is a nextPageToken set it

            YouTube.subscriptions.list(params, function(err, response) {
                if(err) {
                    reject(err);
                } else {
                    if(subs == undefined) subs = []; // if it's the first time thought initialize the array
                    subs = subs.concat(response.items);
                    resolve(getSubscriptions(auth, subs, response.nextPageToken)); // recursive!
                }
            });
        });
    } else { // if there is no nextPageToken and subs has been initialized, we are done
        return subs;
    }
}

function getVideos(auth, channelId, videos, nextPageToken) {

    if(nextPageToken || videos == undefined) {

        if(videos && videos.length >= 100) {
            return videos;
        }

        return new Promise((resolve, reject) => {

            let params = {
                part: 'snippet',
                type: 'video',
                channelId: channelId,
                maxResults: 50,
                order: 'date',
                auth: auth
            };

            if(nextPageToken) params.pageToken = nextPageToken;

            YouTube.search.list(params, function(err, response) {
                    if(err) {
                        logger.error(`Failed to get videos for ${channelId}`, err);
                        reject(err);
                    } else {
                        if(videos == undefined) videos = [];
                        videos = videos.concat(response.items);
                        resolve(getVideos(auth, channelId, videos, response.nextPageToken));
                    }
                }
            );
        });
    } else {
        return videos;
    }
}

module.exports = YouTubeService;