var searchParameterPattern = {
    key: Match.Optional(String),
    concept:  Match.OneOf('users', 'files', 'students', 'communities', 'all'),
    advancedSearch: Match.Optional(Boolean),
    /*Users*/
    userEmail: Match.Optional(Boolean),
    userName: Match.Optional(Boolean),
    userSurname: Match.Optional(Boolean),
    userType: Match.Optional(Match.OneOf('staff', 'admin')),
    /*Archives*/
    /*Students*/
    /*Communities*/
    communityName: Match.Optional(Boolean),
    communityTopics: Match.Optional(Boolean),
    communityType: Match.Optional(Match.OneOf('activity_group', 'student_group', 'professional_group'))
};

Meteor.publish('search', function(searchParameters){
    check(searchParameters, searchParameterPattern);

    var concept = searchParameters.concept;
    var userId = this.userId;
    switch (concept) {
        case 'users':
            return searchUsers(searchParameters);
            break;
        case 'files':
            return searchFiles(searchParameters);
            break;
        case 'students':
            return searchStudents(searchParameters, userId);
            break;
        case 'communities':
            return searchCommunities(searchParameters);
            break;
        case 'all':
            return search(searchParameters);
            break;
        default:
            return this.ready();
    }
});

function searchUsers(searchParameters){
    var mongoParameters = [];
    var key = searchParameters.key || '';
    var includeKeyRegex = {
        $regex: key,
        $options: 'i'
    };
    if(searchParameters.advancedSearch){
        if(key){
            if(searchParameters.userEmail){
                mongoParameters.push({
                    'profile.email': includeKeyRegex
                });
            }
            if(searchParameters.userSurname){
                mongoParameters.push({
                    'profile.surname': includeKeyRegex
                });
            }
            if(searchParameters.userName){
                mongoParameters.push({
                    'profile.name': includeKeyRegex
                });
            }
        }
    }else{
        mongoParameters = [
            {'profile.email': includeKeyRegex},
            {'profile.surname': includeKeyRegex},
            {'profile.name': includeKeyRegex}
        ]
    }

    var query;
    if(searchParameters.userType){
        query = {$and: [
            {$or: mongoParameters},
            {'type': searchParameters.type}
        ]};
    }else{
        query = {$or: mongoParameters};
    }
    
    var result = Meteor.users.find(
        query,{
        fields: {
            emails: 1,
            profile: 1
        }}
    );
    console.log(result.fetch());
    return result;
}

function searchFiles(key) {

}

function searchStudents(searchParameters, userId) {
    var key = searchParameters.key || '';
    var includeKeyRegex = {
        $regex: key,
        $options: 'i'
    };

    var mongoParameters = [
        {'profile.completeName': includeKeyRegex}
    ];

    var userType = Meteor.users.findOne(userId, {type:1}).type;
    var students;
    
    var query;
    if(userType!=='admin'){
        var usersStudents = Communities.aggregate(
            {$match: {
                type: "student_group",
                users: userId
            }},
            {$group: {
                _id:null,
                studentsId:{$addToSet: "$information.students"}
            }}
        )[0];
        if(usersStudents){
            var usersStudentsId = usersStudents.studentsId;
            query = {$and: [
                {$or: mongoParameters},
                {_id: {$in: usersStudentsId}}
            ]};
        }else{
            return this.ready();
        }
    }else{
        query = {$or: mongoParameters};
    }
    
    var result = Students.find(
        query,{
        fields: {
            profile: 1
        }}
    );
    console.log(result.fetch());
    return result;
}

function searchCommunities(searchParameters) {
    var mongoParameters = [];
    var key = searchParameters.key || '';
    var includeKeyRegex = {
        $regex: key,
        $options: 'i'
    };
    if(searchParameters.advancedSearch){
        if(key){
            if(searchParameters.communityName){
                mongoParameters.push({
                    name: includeKeyRegex
                });
            }
            if(searchParameters.communityTopics) {
                mongoParameters.push({
                    topics: new RegExp(key, 'i')
                });
            }
        }
    }else{
        mongoParameters = [
            {name: includeKeyRegex}
        ]
    }

    var query;
    var communityType = searchParameters.communityType;
    if(communityType){
        query = {$and: [
            {$or: mongoParameters},
            {type: communityType}
        ]};
    }else{
        query = {$or: mongoParameters};
    }
    console.log(mongoParameters);
    console.log(query);

    var result = Communities.find(
        query,{
            fields: {
                name: 1,
                type: 1
            }}
    );
    console.log(result.fetch());
    return result;
}

function search(key) {

}
