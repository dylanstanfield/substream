// libraries
let google = require('googleapis');
let OAuth2 = google.auth.OAuth2;
let comb = require('comb');

// config
let googleConfig = require('./../config/google');

// services
let OAuth2Service = require('./../services/oauth2');
let YouTube = require('./../services/youtube');
let Config = require('./../services/config');

let logger = comb.logger('ss.controllers.login');

class LoginController {

    /**
     * Gets the url for users to authorize this app
     * @returns {*}
     */
    static generateGoogleAuthUrl() {
        let client = new OAuth2(
            googleConfig.clientId,
            googleConfig.clientSecret,
            googleConfig.redirectUrl);

        return client.generateAuthUrl({
            access_type: 'offline', // 'online' (default) or 'offline' (gets refresh_token)
            scope: googleConfig.scopes,
            approval_prompt: 'force' // gets refresh token on every login, without it's only on the first
        });
    }

    /**
     * Completes Google authorization then gets user's config data and channel info
     * @param accessCode
     * @returns {Promise}
     */
    static setupUser(accessCode) {
        logger.debug(`Setting up user...`);

        return new Promise((resolve, reject) => {
            let auth = new OAuth2(
                googleConfig.clientId,
                googleConfig.clientSecret,
                googleConfig.redirectUrl);

            let user = {};

            OAuth2Service.getTokenForCode(accessCode, auth).then(token => {
                user.creds = JSON.stringify(token);
                auth.setCredentials(token);
                return Promise.all([YouTube.getUserInfo(auth), Config.getConfig(auth)]);
            }).then(results => {
                user.info = results[0];
                user.config = results[1];
                logger.debug(`Retrieved config and user info for ${user.info.title}`);
                resolve(user);
            }).catch(err => {
                logger.error(`Failed to setup user - ${err.message}`);
                reject(err);
            });
        });
    }

}

module.exports = LoginController;