var uuid = require('uuid-v4');

class Folder {

    constructor(id = uuid(),  name = "", subIds = []) {
        this.id = id;
        this.name = name;
        this.subIds = subIds;
    }

    add(subId) {
        this.subIds.push(subId);
    }

    remove(subId) {
        let i = this.subIds.indexOf(subId);
        if (i > -1) this.subIds.splice(i, 1);
        else console.log('Unable to remove - Not found'); //TODO move to logger
    }

    static fromJson(json) {
        return new Folder(json.name, json.subIds);
    }
}

module.exports = Folder;