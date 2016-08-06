// libraries
let express = require('express');
let comb = require('comb');

// controllers
let StreamsController = require('./../../controllers/streams');

// middlewares
let mw = require('./../middleware/index');

let router = express.Router();
let logger = comb.logger('ss.routes.api.streams');

router.use('/', mw.checkSession.statusCode);

/**
 * Create a stream for a user
 */
router.post('/', function(req, res, next) {
    logger.debug(`Request to create stream...`);

    StreamsController.createStream(req.session.user, req.body.name, req.body.subIds).then(streamId => {
        logger.debug(`Request to create stream was successful`);
        res.json(streamId);
    }).catch(err => {
        logger.error(`Request to create stream failed`, err);
    });
});

/**
 * Delete a user's stream
 */
router.delete('/', function(req, res, next) {
    logger.debug(`Request to delete stream...`);

    StreamsController.deleteStream(req.session.user, req.body.folderId).then(() => {
        logger.debug(`Request to delete stream was successful`);
        res.sendStatus(200); // Success
    }).catch(err => {
        logger.error(`Request to delete stream failed`, err);
    });
});

/**
 * Get all streams for a user
 */
router.get('/', function(req, res, next) {
    logger.debug(`Request to get all stream...`);

    StreamsController.getAllSubs(req.session.user).then(subs => {
        return StreamsController.getAllStreams(req.session.user, subs);
    }).then(streams => {
        logger.debug(`Request to get all streams was successful`);
        res.json(streams);
    }).catch(err => {
        logger.error(`Request to get all streams failed`, err);
    });
});

/**
 * Get a stream for a user
 */
router.get('/:id', function(req, res, next) {
    logger.debug(`Request to get stream...`);

    StreamsController.getAllSubs(req.session.user).then(subs => {
        return StreamsController.getStream(req.session.user, subs, req.params.id);
    }).then(stream => {
        logger.debug(`Request to get stream was successful`);
        res.json(stream);
    }).catch(err => {
        logger.error(`Request to get stream failed`, err);
    });
});

/**
 * Modify a stream for a user
 */
router.patch('/:id', function(req, res, next) {
    logger.debug(`Request to modify stream...`);

    StreamsController.updateStream(req.session.user, req.params.id, JSON.parse(req.body.subs)).then(() => {
        logger.debug(`Request to modify stream was successful`);
        res.sendStatus(200); // Success
    }).catch(err => {
        logger.error(`Request to modify stream failed`, err);
    });
});

/**
 * Get videos for a stream
 */
router.get('/:id/videos', function(req, res, next) {
    logger.debug(`Request to get videos for a stream...`);

    StreamsController.getVideos(req.session.user, req.params.id).then(results => {
        logger.debug(`Request to get videos for a stream was successful`);
        res.json(results);
    }).catch(err => {
        logger.error(`Request to get videos for a stream failed`, err);
    })
});

module.exports = router;