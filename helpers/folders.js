// libraries
var comb = require('comb');

// models
let FolderVM = require('./../models/viewmodels/folderVM');

var logger = comb.logger('ss.helpers.folders');

class FoldersHelper {

    /**
     * Builds folderVMs by mapping folders and its subIds to subs
     * @param subs
     * @param configData
     * @returns {Promise}
     */
    static buildFolderVMs(subs, configData) {
        let folders = configData.folders;
        let folderVMs = [];

        return new Promise((resolve, reject) => {

            for(let folder of folders) {
                let folderVM = new FolderVM(folder.id, folder.name, []);

                for(let subId of folder.subIds) {
                    for(let sub of subs) {
                        if(sub.snippet.resourceId.channelId === subId) folderVM.add(sub);
                    }
                }

                folderVMs.push(folderVM);
            }

            resolve(folderVMs);
        });
    }

    /**
     * Builds a folderVM by mapping subIds to subs
     * @param subs
     * @param configData
     * @param id
     * @returns {Promise}
     */
    static buildFolderVM(subs, configData, id) {
        let folders = configData.folders;
        let folderVM = null;

        return new Promise((resolve, reject) => {

            for(let folder of folders) {
                if(folder.id == id) {
                    folderVM = new FolderVM(folder.id, folder.name, []);
                    for(let subId of folder.subIds) {
                        for(let sub of subs) {
                            if(sub.snippet.resourceId.channelId === subId) folderVM.add(sub);
                        }
                    }
                    break;
                }
            }

            resolve(folderVM);
        });
    }

    /**
     * Gets a folder from config data given its id
     * @param configData
     * @param id
     * @returns {Promise}
     */
    static getFolderById(configData, id) {
        return new Promise((resolve, reject) => {

            let f = null;

            if(configData.folders) {
                for(let folder of configData.folders) {
                    if(folder.id == id) {
                        f = folder;
                    }
                }
            }

            resolve(f);
        });
    }

    /**
     * Extracts a list of subIds from a list of YouTube sub json objects
     * @param subs
     * @returns {Promise}
     */
    static getSubIds(subs) {
        return new Promise((resolve, reject) => {
            let subIds = [];

            for(let sub of subs) {
                subIds.push(sub.snippet.resourceId.channelId);
            }

            resolve(subIds);
        })
    }
}

module.exports = FoldersHelper;