var express = require('express');
var router = express.Router();

var YouTubeService = require('./../services/youtubeService');
var youtube = new YouTubeService();

var ConfigService = require('./../services/configService');
var configService = new ConfigService();

var OAuth2Service = require('./../services/oauth2Service');
var authConfig = require('./../config/auth');

var googleAuthUrl = OAuth2Service.generateGoogleAuthUrl(
    authConfig.googleAuth.clientID,
    authConfig.googleAuth.clientSecret,
    authConfig.googleAuth.callbackURL,
    authConfig.googleAuth.scopes
);

var oauthTest;

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/auth/google', function(req, res, next) {
    res.redirect(googleAuthUrl);
});

router.get('/auth/google/callback', function(req, res, next) {
    console.log('callback' + req.query.code);
    let oauth2Service = new OAuth2Service(
        authConfig.googleAuth.clientID,
        authConfig.googleAuth.clientSecret,
        authConfig.googleAuth.callbackURL);

    OAuth2Service.setTokensForCode(req.query.code, oauth2Service.client).then(() => {
        // store oauth2Client in session
        oauthTest = oauth2Service.client;

        console.log(oauthTest);

        res.redirect('/subs');
    });
});

router.get('/subs', function(req, res, next) {
    youtube.getCurrentUserInfo(oauthTest).then((user) => {
        youtube.getSubscriptionList(oauthTest).then((subs) => {
            configService.getConfig(oauthTest).then((config) => {
                console.log(config);
                config.data.updated = 'this has been updated';
                configService.updatedConfig(config.data, config.id, oauthTest).then((fileId) => {
                    console.log(fileId);
                    configService.getFile(fileId, oauthTest).then((file) => {
                        console.log(file);
                        res.render('subs', { subs: subs, user: user })
                    });
                });
            }).catch((err) => {
                console.log(err);
            });
        }).catch((err) => {
            console.log(err);
        });
    }).catch((err) => {
        console.log(err);
    });
});

module.exports = router;
