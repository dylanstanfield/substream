var express = require('express');
var router = express.Router();

var YouTube = require('./../services/youtubeService');
var Drive = require('./../services/driveService');
var OAuth2Service = require('./../services/oauth2Service');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'substream' });
});

router.get('/subs', function(req, res, next) {

    var $auth = null;

    OAuth2Service.getAuthClientForCreds(req.session.auth).then((auth) => {
        $auth = auth;
        return YouTube.getSubscriptionList($auth);
    }).then((subs) => {
        console.log(subs[0].snippet);
        res.render('subs', {
            user: req.session.user,
            config: req.session.config,
            subs: subs
        });
    }).catch((err) => {
        console.log(err);
    });

});

module.exports = router;
