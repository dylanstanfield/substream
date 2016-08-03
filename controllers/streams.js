var comb = require('comb');
var logger = comb.logger('ss.controllers.streams');

var YouTube = require('./../services/youtubeService');

var OAuth2Helper = require('./../helpers/oauth2');

class StreamsController {
    static getAllStreams(creds) {
        return new Promise((resolve, reject) => {
            OAuth2Helper.getAuth(creds).then((auth) => {
                return YouTube.getSubscriptions(auth);
            }).then((subs) => {
                resolve(subs);
            }).catch((err) => {
                reject(err);
            });
        });
    }
}

module.exports = StreamsController;