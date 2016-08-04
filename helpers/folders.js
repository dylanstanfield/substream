let testFolders = [
    {
        name: 'Stuff',
        subIds: [
            'FMJAXATLe-0Y6TMmLcw7F7dPZtrDJG_uuTd9ZZR9RPU'
        ],
        subs: []
    }
];

let organizeSubsIntoFolders = (subs, folders) => {
    // TODO: take this part out, allowing to pass in folders
    folders = testFolders;

    return Promise.resolve().then(() => {

        // Loop through the folders to look for matches.
        for (var i = 0; i < folders.length; i++) {

            // Loop through the specific sub id's
            for (var j = 0; j < folders[i].subIds.length; j++) {

                // Loop through the individual subscriptions, looking for matches
                for (var k = 0; k < subs.length; k++) {
                    if (subs[k].id === folders[i].subIds[j]) {
                        folders[i].subs.push(subs[k]);
                    }
                }
            }
        }

        return folders;
    });
};

module.exports.organizeSubsIntoFolders = organizeSubsIntoFolders;