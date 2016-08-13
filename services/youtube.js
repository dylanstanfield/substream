// libraries
var google = require('googleapis');
var YouTube = google.youtube('v3');
var comb = require('comb');

// config
var config = require('./../config/service').youtube;

// helpers
let DatesHelper = require('./../helpers/dates');

var logger = comb.logger('ss.services.youtube');

class YouTubeService {

    /**
     * Get's subscriptions for a user
     * @param auth
     * @returns {Promise} resolves to a list of subscriptions
     */
    static getSubscriptions(auth) {
        logger.debug(`Getting subscriptions...`);

        return getSubscriptions(auth).then(subs => { // private method for handling pagination from YouTube
            logger.debug(`Successfully got subscriptions`);
            return subs;
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
                        logger.error(`Failed to get user info - ${err.message}`);
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
            let publishedAfter = DatesHelper.startOfPastMonth(config.numMonthsToFetchVideos);

            getVideos(auth, channelId, DatesHelper.convertToRCF3339(publishedAfter)).then(videos => {
                resolve(videos);
            }).catch(err => {
                logger.error(`Failed to get videos - ${err.message}`);
                reject(err);
            });
        });
    }
}

/**
 * Private method that loops to make calls to YouTube for subscriptions
 * @param auth
 * @param subs
 * @param nextPageToken
 * @returns {*}
 */
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
                    if(subs == undefined) subs = []; // initialize subs if they are undefined (first pass probably)
                    subs = subs.concat(response.items);
                    resolve(getSubscriptions(auth, subs, response.nextPageToken)); // recursive!
                }
            });
        });
    } else { // if there is no nextPageToken and subs has been initialized, we are done
        return subs;
    }
}

/**
 * Private method that loops to make calls to YouTube for videos
 * @param auth
 * @param channelId
 * @param publishedAfter
 * @param videos
 * @param nextPageToken
 * @returns {*}
 */
function getVideos(auth, channelId, publishedAfter, videos, nextPageToken) {

    if(nextPageToken || videos == undefined) { // videos and nextPageToken will be undefined first time through

        return new Promise((resolve, reject) => {

            let params = {
                part: 'snippet',
                type: 'video',
                publishedAfter: publishedAfter,
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
                        if(videos == undefined) videos = []; // initialize videos if they are undefined (first pass probably)
                        videos = videos.concat(response.items);
                        resolve(getVideos(auth, channelId, publishedAfter, videos, response.nextPageToken)); // recursive!
                    }
                }
            );
        });
    } else { // if there is no nextPageToken and videos is initialized, we are done
        return videos;
    }
}

module.exports = YouTubeService;