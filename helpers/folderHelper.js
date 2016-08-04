let testFolders = [
    {
        name: 'Webapps',
        subIds: [
            'FMJAXATLe-0Y6TMmLcw7F0OIW6kWo7KvZcZxJPJ8ccE',
            'FMJAXATLe-0Y6TMmLcw7FzoinykcZHFuVToSGLn_lpY',
            'FMJAXATLe-0Y6TMmLcw7F9rxLGsvk_9lbU92AyYHR9I',
            'FMJAXATLe-0Y6TMmLcw7F2LM6eGgLFwRBaNNU0jaZm4'
        ],
        subs: []
    },
    {
        name: 'Javascript',
        subIds: [
            'FMJAXATLe-0Y6TMmLcw7F3RmgzBYa7ob1KLCBWWcDog'
        ],
        subs: []
    },
    {
        name: 'PHP JS',
        subIds: [
            'FMJAXATLe-0Y6TMmLcw7F32YV9eAiGyyaZcFt_PbzQE'
        ],
        subs: []
    },
    {
        name: 'Nerd',
        subIds: [
            'FMJAXATLe-0Y6TMmLcw7FyBZ_3ufaJbba2RG0zHa4g0'
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