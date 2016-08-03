var express = require('express');
var router = express.Router();

var YouTubeService = require('./../services/youtubeService');
var youtube = new YouTubeService();

var ConfigService = require('./../services/configService');
var configService = new ConfigService();

var OAuth2Service = require('./../services/oauth2Service');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'substream' });
});

router.get('/subs', function(req, res, next) {

    let $user = null;
    let $subs = null;
    let $auth = null;

    OAuth2Service.getAuthClientForCreds(req.session.auth).then((auth) => {
        $auth = auth;
        return youtube.getCurrentUserInfo($auth);
    }).then((user) => {
        $user = user;
        return youtube.getSubscriptionList($auth);
    }).then((subs) => {
        $subs = subs;
        return configService.getConfig($auth);
    }).then((config) => {
        config.data.updated = 'this has been updated';
        return configService.updatedConfig(config.data, config.id, $auth);
    }).then((fileId) => {
        return configService.getFile(fileId, $auth);
    }).then((config) => {
        res.render('subs', { subs: $subs, user: $user, config: config })
    }).catch((err) => {
        console.log(err);
    });

});

module.exports = router;
