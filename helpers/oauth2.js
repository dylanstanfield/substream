// libraries
var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var comb = require('comb');

// config
var googleConfig = require('./../config/google');

var logger = comb.logger('ss.helpers.oauth');

class OAuth2Helper {

    /**
     * Makes an oauth2 client object for a user's credentials
     * @param creds
     * @returns {google.auth.OAuth2}
     */
    static getAuth(creds) {
        let client = new OAuth2(
            googleConfig.clientId,
            googleConfig.clientSecret,
            googleConfig.redirectUrl);

        client.setCredentials(creds);

        return client;
    }
}

module.exports = OAuth2Helper;