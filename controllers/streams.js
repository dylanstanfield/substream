var comb = require('comb');
var logger = comb.logger('ss.controllers.streams');

var YouTube = require('./../services/youtube');
var OAuth2Helper = require('./../helpers/oauth2');

let FoldersHelper = require('./../helpers/folders');
let ConfigData = require('./../models/configData');

class StreamsController {
    static getAllStreams(user, subs) {
        return new Promise((resolve, reject) => {
            FoldersHelper.buildFolderVMs(subs, ConfigData.fromJson(user.config.data)).then(folderVMs => {
                resolve(folderVMs);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    static getAllSubs(user) {
        return new Promise((resolve, reject) => {
            OAuth2Helper.getAuth(user.creds).then(auth => {
                return YouTube.getSubscriptions(auth);
            }).then(subs => {
                resolve(subs);
            }).catch(err => {
                reject(err);
            })
        });
    }
}

module.exports = StreamsController;