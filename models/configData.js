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

    removeFolderById(folderId) {
        this.folders.forEach(function(folder, index) {
            if(folderId == folder.id) {
                this.folders.splice(index, 1);
                return
            }
        })
    }

    static fromJson(json) {
        let config = new ConfigData(json.version, [], json.created, json.lastSaved);

        json.folders.forEach(function(folder) {
            config.add(Folder.fromJson(folder));
        });

        return config;
    }
}

module.exports = ConfigData;