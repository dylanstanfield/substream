var express = require('express');
var router = express.Router();

var comb = require('comb');
var logger = comb.logger('ss.routes.auth');

var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var OAuth2Service = require('./../services/oauth2Service');
var authConfig = require('./../config/auth');

var YouTube = require('./../services/youtubeService');
var Drive = require('./../services/driveService');

var googleAuthUrl = OAuth2Service.generateGoogleAuthUrl(
    authConfig.googleAuth.clientID,
    authConfig.googleAuth.clientSecret,
    authConfig.googleAuth.callbackURL,
    authConfig.googleAuth.scopes
);

router.get('/google', function(req, res, next) {
    logger.debug('Sending user to authenticate with Google');
    res.redirect(googleAuthUrl);
});

router.get('/google/callback', function(req, res, next) {

    logger.debug(`Received callback from Google`);

    let auth = new OAuth2(
        authConfig.googleAuth.clientID,
        authConfig.googleAuth.clientSecret,
        authConfig.googleAuth.callbackURL);

    OAuth2Service.setTokensForCode(req.query.code, auth).then(() => {
        logger.debug(`Set tokens for the user's code`);
        req.session.auth = auth;
        return YouTube.getCurrentUserInfo(auth);
    }).then((user) => {
        logger.debug(`User is ${user.title}`);
        req.session.user = user;
        return Drive.getConfig(auth);
    }).then((config) => {
        logger.debug(`Retrieved user's config file from Google Drive`);
        req.session.config = config;
        res.redirect('/subs');
    }).catch((err) => {
        logger.error(`
            Failed to setup user:
            ${err}
        `);
    });
});

module.exports = router;