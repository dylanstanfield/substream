# substream
Trying to create a better way to manage your YouTube subscriptions.

## Configuration
To get this thing running you'll need to create a [Google APIs project](https://console.developers.google.com/apis/dashboard).

You'll need to enable the YouTube and Drive APIs though the Library section.

After your APIs are enabled, create credentials for a Web application.

Set one of your Authorized JavaScript origins to `http://localhost:3000` and one of your Authorized redirect URIs to `http://localhost:3000/login/google/callback`. These can be changed if you're not running it locally.

Finally, create `config/google.js` in from the root of substream. Add in the variables from the credentials you created for your Google APIs project.

```javascript
// config/google.js

module.exports = {
    clientId: <INSERT YOUR CLIENT ID>,
    clientSecret: <INSERT YOUR CLIENT SECRET>,
    redirectUrl: 'http://localhost:3000/login/google/callback', // or your custom callback
    scopes: [
        'https://www.googleapis.com/auth/youtube',
        'https://www.googleapis.com/auth/drive.appdata'
    ]
};
```