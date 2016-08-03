var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var authConfig = require('./../config/auth');

class OAuth2Service {

    static generateGoogleAuthUrl() {
        let client = new OAuth2(
            authConfig.googleAuth.clientID,
            authConfig.googleAuth.clientSecret,
            authConfig.googleAuth.callbackURL);

        return client.generateAuthUrl({
            access_type: 'offline', // 'online' (default) or 'offline' (gets refresh_token)
            scope: authConfig.googleAuth.scopes
        });
    }

    static setTokensForCode(code, oauth2Client) {
        return new Promise((resolve, reject) => {
            oauth2Client.getToken(code, function(err, tokens) {
                // Now tokens contains an access_token and an optional refresh_token. Save them.
                if (err) reject(err);
                else resolve(oauth2Client.setCredentials(tokens));
            });
        });
    }

    static getAuth(creds) {
        return new Promise((resolve, reject) => {
            let client = new OAuth2(
                authConfig.googleAuth.clientID,
                authConfig.googleAuth.clientSecret,
                authConfig.googleAuth.callbackURL);

            client.credentials = creds;

            resolve(client);
        });
    }

}

module.exports = OAuth2Service;