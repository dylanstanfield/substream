var express = require('express');
var router = express.Router();

var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;

var OAuth2Service = require('./../services/oauth2Service');
var authConfig = require('./../config/auth');

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

    let oauth2Client = new OAuth2(
        authConfig.googleAuth.clientID,
        authConfig.googleAuth.clientSecret,
        authConfig.googleAuth.callbackURL);

    OAuth2Service.setTokensForCode(req.query.code, oauth2Client).then(() => {
        req.session.auth = oauth2Client;
        res.redirect('/subs');
    });
});

module.exports = router;