# substream
Trying to create a better way to manage your youtube subscriptions.

## Configuration
To get this thing running you'll need to create a [Google APIs project](https://console.developers.google.com/apis/dashboard).

Create credentials for a Web application.

Set one of your Authorized JavaScript origins to `http://localhost:3000` and one of your Authorized redirect URIs to `http://localhost:3000/auth/google/callback`.

Finally, create `config/auth.js` in from the root of substream. Add in the variables from the credentials you created for your Google APIs project.

```javascript
// config/auth.js

module.exports = {
    'googleAuth' : {
        'clientID': <INSERT YOUR CLIENT ID>,
        'clientSecret': <INSERT YOUR CLIENT SECRET>,
        'callbackURL': 'http://localhost:3000/auth/google/callback',
        'scopes': [
            'https://www.googleapis.com/auth/youtube',
            'https://www.googleapis.com/auth/drive.appdata'
        ]
    }
};
```