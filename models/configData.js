var Folder = require('./folder');

class ConfigData {
    constructor(version = 1, folders = [], created = new Date(), lastSaved = null) {
        this.version = version;
        this.folders = folders;
        this.created = created;
        this.lastSaved = lastSaved;
    }

    addFolder(folder) {
        this.folders.push(folder);
    }

    deleteFolderById(folderId) {
        let self = this;

        return new Promise((resolve, reject) => {

            var didDelete = false;

            if(self.folders) {
                for(let i in self.folders) {
                    if(folderId == self.folders[i].id) {
                        self.folders.splice(i, 1);
                        didDelete = true;
                        break;
                    }
                }
            }

            if(didDelete) resolve(true);
            else reject(new Error(`Unable to delete folder with id ${folderId}`));
        });
    }

    setSubIdsForId(folderId, subIds) {
        let self = this;

        return new Promise((resolve, reject) => {

            var didUpdate = false;

            if(self.folders) {
                for(let i in self.folders) {
                    if(folderId == self.folders[i].id) {
                        self.folders[i].subIds = subIds;
                        didUpdate = true;
                        break;
                    }
                }
            }

            if(didUpdate) resolve(true);
            else reject(new Error(`Unable to set subIds folder with id ${folderId}`));
        });
    }

    static fromJson(json) {
        let config = new ConfigData(json.version, [], json.created, json.lastSaved);

        for(let folder of json.folders) {
            config.addFolder(Folder.fromJson(folder));
        }

        return config;
    }
}

module.exports = ConfigData;