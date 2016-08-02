var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;

class OAuth2Service {

    constructor(clientId, clientSecret, redirectUrl) {
        this.client = new OAuth2(clientId, clientSecret, redirectUrl);
    }

    static generateGoogleAuthUrl(clientId, clientSecret, redirectUrl, scopes) {
        let client = new OAuth2(clientId, clientSecret, redirectUrl);
        return client.generateAuthUrl({
            access_type: 'offline', // 'online' (default) or 'offline' (gets refresh_token)
            scope: scopes
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
}

module.exports = OAuth2Service;