// libraries
var comb = require('comb');

// logger
var logger = comb.logger('ss.services.oauth');

class OAuth2Service {

    /**
     * Sets token in an oauth 2 client
     * @param code
     * @param oauth2Client
     * @returns {Promise} which resolves to true for success
     */
    static setTokensForCode(code, oauth2Client) {
        logger.debug(`Setting tokens for code...`);

        return new Promise((resolve, reject) => {
            oauth2Client.getToken(code, function(err, tokens) {
                // Now tokens contains an access_token and an optional refresh_token. Save them.
                if (err) {
                    logger.error(`Failed to set tokens for code - ${err.message}`);
                    reject(err);
                } else {
                    logger.debug(`Successfully set tokens for code`);
                    oauth2Client.setCredentials(tokens);
                    resolve(true);
                }
            });
        });
    }

}

module.exports = OAuth2Service;