class FolderVM {
    constructor(folderId = null, name = "", subs = []) {
        this.folderId = folderId;
        this.name = name;
        this.subs = subs;
    }

    add(sub) {
        this.subs.push(sub);
    }
}

module.exports = FolderVM;