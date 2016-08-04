let express = require('express');
let router = express.Router();

let comb = require('comb');
let logger = comb.logger('ss.routes.index');

let StreamsController = require('./../controllers/streams');

let folderHelper = require('./../helpers/folders');

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
    StreamsController.getAllStreams(req.session.user.creds).then(subs => {
        $subs = subs;

        // TODO: take in folder rules instead of empty array (which is currently overridden inside function)
        return folderHelper.organizeSubsIntoFolders(subs, req.session.user.config.data.folders);
    }).then((folders) => {
        res.render('streams', {
            user: req.session.user.info,
            config: req.session.user.config,
            subs: $subs,
            folders: folders
        });
    }).catch(err => {
        logger.error(err);
    });
});

module.exports = router;
