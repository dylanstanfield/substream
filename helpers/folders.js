let FolderVM = require('./../models/viewmodels/folderVM');

class FoldersHelper {

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