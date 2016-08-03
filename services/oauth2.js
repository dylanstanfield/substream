class OAuth2Service {

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