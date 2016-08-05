let express = require('express');
let router = express.Router();

let comb = require('comb');
let logger = comb.logger('ss.routes.api');

let mw = require('./middleware');

let StreamsController = require('./../controllers/streams');

// create new stream
router.post('/streams', mw.apiSessionProtected, function(req, res, next) {
    StreamsController.createStream(req.session.user, req.body.name, req.body.subIds).then(streamId => {
        res.json(streamId);
    }).catch(err => {
        logger.error(err);
    });
});

// delete stream
router.delete('/streams', mw.apiSessionProtected, function(req, res, next) {
    StreamsController.deleteStream(req.session.user, req.body.folderId).then(() => {
        res.sendStatus(202);
    }).catch(err => {
        logger.error(err);
    });
});

// get all streams
router.get('/streams', mw.apiSessionProtected, function(req, res, next) {
    StreamsController.getAllSubs(req.session.user).then(subs => {
        return StreamsController.getAllStreams(req.session.user, subs);
    }).then(streams => {
        res.json(streams);
    }).catch(err => {
        logger.error(err);
    });
});

// get single stream
router.get('/streams/:id', mw.apiSessionProtected, function(req, res, next) {
    StreamsController.getAllSubs(req.session.user).then(subs => {
        return StreamsController.getStream(req.session.user, subs, req.params.id);
    }).then(stream => {
        res.json(stream);
    }).catch(err => {
        logger.error(err);
    });
});

// modify a stream
router.patch('/streams/:id', mw.apiSessionProtected, function(req, res, next) {
    StreamsController.updateStream(req.session.user, req.params.id, JSON.parse(req.body.subs)).then(() => {
        res.sendStatus(204);
    }).catch(err => {
        logger.error(err);
    });
});

module.exports = router;