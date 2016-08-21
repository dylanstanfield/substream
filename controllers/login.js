// libraries
var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var comb = require('comb');

// config
var googleConfig = require('./../config/google');

// services
var OAuth2Service = require('./../services/oauth2');
var YouTube = require('./../services/youtube');
var Config = require('./../services/config');

var logger = comb.logger('ss.controllers.login');

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
            scope: googleConfig.scopes
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
                user.creds = token;
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