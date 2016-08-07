// libraries
var express = require('express');
var comb = require('comb');

// controllers
var LoginController = require('./../controllers/login');

var router = express.Router();
var logger = comb.logger('ss.routes.login');

/**
 * Redirects user to login with Google
 */
router.get('/google', function(req, res, next) {
    logger.info('Sending user to authenticate with Google');
    res.redirect(LoginController.generateGoogleAuthUrl());
});

/**
 * Callback for Google, sets up a user given a code in the query
 */
router.get('/google/callback', function(req, res, next) {
    logger.info(`Received callback from Google`);
    LoginController.setupUser(req.query.code).then((user) => {
        req.session.user = user;
        logger.info(`${user.info.title} logged in - redirecting to home page`);
        res.redirect('/');
    }).catch(err => {
        logger.error(`Login failed - ${err.message}`);
        res.redirect('/'); // TODO set up an error message
    });
});

module.exports = router;