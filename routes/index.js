// libraries
let express = require('express');
let comb = require('comb');

// controllers
let StreamsController = require('./../controllers/streams');

// middlewares
let mw = require('./middleware');

let router = express.Router();
let logger = comb.logger('ss.routes.index');

/**
 * Gets user's home page or renders login
 */
router.get('/', mw.checkSession.redirect, function(req, res, next) {
    logger.debug(`Request to index`);

    let $subs = [];

    StreamsController.getAllSubs(req.session.user).then(subs => {
        $subs = subs;
        return StreamsController.getAllStreams(req.session.user, subs);
    }).then(streams => {
        logger.debug(`Request to index successful - rendering user's home page`);
        res.render('streams', {
            user: req.session.user.info,
            config: req.session.user.config,
            subs: $subs,
            streams: streams
        });
    }).catch(err => {
        logger.error('Request to index failed', err);
    });
});

module.exports = router;
