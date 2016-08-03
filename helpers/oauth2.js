// libraries
var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;

// config
var googleConfig = require('./../config/google');

class OAuth2Helper {

    static getAuth(creds) {
        return new Promise((resolve, reject) => {
            let client = new OAuth2(
                googleConfig.clientId,
                googleConfig.clientSecret,
                googleConfig.redirectUrl);

            client.credentials = creds;

            resolve(client);
        });
    }
}

module.exports = OAuth2Helper;