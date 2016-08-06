class FolderVM {
    constructor(folderId = null, name = "", subs = []) {
        this.folderId = folderId;
        this.name = name;
        this.subs = subs;
    }

    /**
     * Adds a folder to this folder view model
     * @param sub
     */
    add(sub) {
        this.subs.push(sub);
    }
}

module.exports = FolderVM;