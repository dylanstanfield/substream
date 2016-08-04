var express = require('express');
var router = express.Router();

var comb = require('comb');
var logger = comb.logger('ss.routes.index');

var StreamsController = require('./../controllers/streams');

var folderHelper = require('./../helpers/folderHelper');

/* GET home page. */
router.get('/', function(req, res, next) {

    if(req.session.user) {
        var $subs = [];

        StreamsController.getAllStreams(req.session.user.creds).then(subs => {
            $subs = subs;
            
            // TODO: take in folder rules instead of empty array (which is currently overridden inside function)
            return folderHelper.organizeSubsIntoFolders(subs, []);

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

    } else {
        res.render('index', { title: 'substream' });
    }

});

module.exports = router;
