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
     * @returns {FolderVM[]}
     */
    static buildFolderVMs(subs, configData) {
        let folders = configData.folders;
        let folderVMs = [];

        for(let folder of folders) {
            let folderVM = new FolderVM(folder.id, folder.name, []);

            for(let subId of folder.subIds) {
                for(let sub of subs) {
                    if(sub.snippet.resourceId.channelId === subId) folderVM.add(sub);
                }
            }

            folderVMs.push(folderVM);
        }

        return folderVMs;
    }

    /**
     * Builds a folderVM by mapping subIds to subs
     * @param subs
     * @param configData
     * @param id
     * @returns {FolderVM}
     */
    static buildFolderVM(subs, configData, id) {
        let folders = configData.folders;
        let folderVM = null;

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

        return folderVM;
    }

    /**
     * Gets a folder from config data given its id
     * @param configData
     * @param id
     * @returns {Folder}
     */
    static getFolderById(configData, id) {
        let f = null;

        if(configData.folders) {
            for(let folder of configData.folders) {
                if(folder.id == id) {
                    f = folder;
                }
            }
        }

        return f;
    }

    /**
     * Extracts a list of subIds from a list of YouTube sub json objects
     * @param subs
     * @returns {String[]}
     */
    static getSubIds(subs) {
        let subIds = [];

        for(let sub of subs) {
            subIds.push(sub.snippet.resourceId.channelId);
        }

        return subIds;
    }
}

module.exports = FoldersHelper;