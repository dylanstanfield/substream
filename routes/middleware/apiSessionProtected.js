/**
 * Middleware function that checks if the user currently has an
 * user object stored in the session, which means they are authenticated.
 * @param req
 * @param res
 * @param next
 */
module.exports = (req, res, next) => {
    if (req.session.user) next();
    else res.json('Error - User\'s session not found')
};