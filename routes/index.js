let express = require('express');
let router = express.Router();

let comb = require('comb');
let logger = comb.logger('ss.routes.index');

let StreamsController = require('./../controllers/streams');

let mw = require('./middleware');

router.get('/', mw.sessionProtected, function(req, res, next) {

    // TODO: add this back in when we want to do caching.
    // if (req.session.subs && req.session.folders) {
    //     res.render('streams', {
    //         user: req.session.user.info,
    //         config: req.session.user.config,
    //         subs: req.session.subs,
    //         folders: req.session.folders
    //     });
    // } else {
    // }

    let $subs = [];

    StreamsController.getAllSubs(req.session.user).then(subs => {
        $subs = subs;
        return StreamsController.getAllStreams(req.session.user, subs);
    }).then(streams => {
        res.render('streams', {
            user: req.session.user.info,
            config: req.session.user.config,
            subs: $subs,
            streams: streams
        });
    }).catch(err => {
        logger.error(err);
    });
});

module.exports = router;
