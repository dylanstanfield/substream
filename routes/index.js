var express = require('express');
var router = express.Router();

var comb = require('comb');
var logger = comb.logger('ss.routes.index');

var StreamsController = require('./../controllers/streams');

/* GET home page. */
router.get('/', function(req, res, next) {

    if(req.session.user) {

        StreamsController.getAllStreams(req.session.user.creds).then(subs => {
            res.render('streams', {
                user: req.session.user.info,
                config: req.session.user.config,
                subs: subs
            });
        }).catch(err => {
            logger.error(err);
        });

    } else {
        res.render('index', { title: 'substream' });
    }

});

module.exports = router;
