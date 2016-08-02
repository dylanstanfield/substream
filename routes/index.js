var express = require('express');
var router = express.Router();

var YouTubeService = require('./../services/youtubeService');
var yts = new YouTubeService();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/auth/google', function(req, res, next) {
    res.redirect(yts.authUrl);
});

router.get('/auth/google/callback', function(req, res, next) {
    yts.setTokenForCode(req.query.code).then(() => {
        res.redirect('/subs')
    });
});

router.get('/subs', function(req, res, next) {
    yts.getCurrentUserInfo().then((user) => {
        yts.getSubscriptionList().then((subs) => {
            yts.getConfig().then((configString) => {
                console.log(configString);
                configString.updated = 'this has been updated';
                yts.updatedConfig(configString).then((fileId) => {
                    console.log(fileId);
                    yts.getFile(fileId).then((file) => {
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

router.get('/configTest', function(req, res, next) {

});

module.exports = router;
