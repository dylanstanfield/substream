// libraries
let comb = require('comb');

let logger = comb.logger('ss.mw.session');

class checkSession {

    /**
     * Checks a user's session and redirects them to home if it's bad
     * @param req
     * @param res
     * @param next
     */
    static redirect(req, res, next) {
        logger.debug(`Checking user's session...`);

        if(req.session.user) {
            logger.debug(`User's session is good`);
            next();
        } else {
            logger.info(`User is not in session - rendering login...`);
            res.render('login', { title: 'substream' });
        }
    }

    /**
     * Checks a user's session and sends a 401 if it's bad
     * @param req
     * @param res
     * @param next
     */
    static statusCode(req, res, next) {
        logger.debug(`Checking user's session...`);

        if(req.session.user) {
            logger.debug(`User's session is good`);
            next();
        } else {
            logger.warn(`User is not in session. Sending 401...`);
            res.sendStatus(401); // Unauthorized
        }
    }
}

module.exports = checkSession;