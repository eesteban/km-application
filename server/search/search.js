var searchParameterPattern = {
    key: String,
    concept:  Match.OneOf('users', 'files', 'students', 'communities', 'all')
};

Meteor.publish('search', function(searchParameters){
    check(searchParameters, searchParameterPattern);

    var key = searchParameters.key;
    var concept = searchParameters.concept;
    
    switch (concept) {
        case 'users':
            return searchUsers(key);
            break;
        case 'files':
            return searchFiles(key);
            break;
        case 'students':
            return searchStudents(key);
            break;
        case 'communities':
            return searchCommunities(key);
            break;
        case 'all':
            return search(key);
            break;
        default:
            return this.ready();
    }
});

function searchUsers(key){
    return  Meteor.users.find(
        {
            $text: {
                $search: key
            }
        });
}

