// libraries
var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var comb = require('comb');

// config
var googleConfig = require('./../config/google');

// services
var OAuth2Service = require('./../services/oauth2');
var YouTube = require('./../services/youtubeService');
var Drive = require('./../services/driveService');

// logger
var logger = comb.logger('ss.controllers.login');

class LoginController {

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

    static setupUser(accessCode) {
        return new Promise((resolve, reject) => {
            let auth = new OAuth2(
                googleConfig.clientId,
                googleConfig.clientSecret,
                googleConfig.redirectUrl);

            let user = {};

            OAuth2Service.setTokensForCode(accessCode, auth).then(() => {
                logger.debug(`Set tokens for the user's code`);
                user.creds = auth.credentials;
                return Promise.all([YouTube.getUserInfo(auth), Drive.getConfig(auth)]);
            }).then(results => {
                user.info = results[0];
                user.config = results[1];
                logger.debug(`Retrieved config and user info for ${user.info.title}`);
                resolve(user);
            }).catch(err => {
                reject(err);
            });
        });
    }
}

module.exports = LoginController;