# substream
Organize your YouTube subscriptions into streams. Browse videos easier.

## How does it work?
Using the YouTube Data and Google Drive API we can show a user the channels they are subscribed to. When they request a grouping (or stream) we store it in a configuration file on the user's Google Drive. Then, when a user browses to a stream we can read their config and pull in recent videos from all the channels in the group.

## Technology
- Polymer (Client side SPA)
- Express/Node (Communicates to YouTube and Google Drive, sends data to client, manages sessions)

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
        'https://www.googleapis.com/auth/youtube.readonly',
        'https://www.googleapis.com/auth/drive.appdata'
    ]
};
```