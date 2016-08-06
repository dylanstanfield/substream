var express = require('express');
var router = express.Router();

var comb = require('comb');
var logger = comb.logger('ss.routes.auth');

var LoginController = require('./../controllers/login');

router.get('/google', function(req, res, next) {
    logger.debug('Sending user to authenticate with Google');
    res.redirect(LoginController.generateGoogleAuthUrl());
});

router.get('/google/callback', function(req, res, next) {
    LoginController.setupUser(req.query.code).then((user) => {
        req.session.user = user;
        logger.info(`${user.info.title} logged in`);
        res.redirect('/');
    }).catch(err => {
        logger.error(err);
        res.redirect('/'); // TODO set up an error message
    });
});

module.exports = router;