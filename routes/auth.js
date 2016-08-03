var express = require('express');
var router = express.Router();

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
    res.redirect(googleAuthUrl);
});

router.get('/google/callback', function(req, res, next) {

    let auth = new OAuth2(
        authConfig.googleAuth.clientID,
        authConfig.googleAuth.clientSecret,
        authConfig.googleAuth.callbackURL);

    OAuth2Service.setTokensForCode(req.query.code, auth).then(() => {
        req.session.auth = auth;
        return YouTube.getCurrentUserInfo(auth);
    }).then((user) => {
        req.session.user = user;
        return Drive.getConfig(auth);
    }).then((config) => {
        req.session.config = config;
        res.redirect('/subs');
    }).catch((err) => {
        console.log(err);
    });
});

module.exports = router;