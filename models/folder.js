// libraries
var uuid = require('uuid-v4');

class Folder {

    constructor(id = uuid(),  name = "", subIds = []) {
        this.id = id;
        this.name = name;
        this.subIds = subIds;
    }

    /**
     * Adds a subId to this folder
     * @param subId
     */
    add(subId) {
        this.subIds.push(subId);
    }

    /**
     * Removes a subId from this folder
     * @param subId
     */
    remove(subId) {
        let i = this.subIds.indexOf(subId);
        if (i > -1) this.subIds.splice(i, 1);
    }

    /**
     * Creates a folder object from a json object
     * @param json
     * @returns {Folder}
     */
    static fromJson(json) {
        return new Folder(json.id, json.name, json.subIds);
    }
}

module.exports = Folder;