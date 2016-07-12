var searchParameterPattern = {
    key: Match.Optional(String),
    concept:  Match.OneOf('users', 'archives', 'students', 'communities', 'all'),
    advancedSearch: Match.Optional(Boolean),
    /*Users*/
    userEmail: Match.Optional(Boolean),
    userName: Match.Optional(Boolean),
    userSurname: Match.Optional(Boolean),
    userType: Match.Optional(Match.OneOf('staff', 'admin')),
    /*Archives*/
    archiveName: Match.Optional(Boolean),
    ownerName: Match.Optional(Boolean),
    deletedArchives: Match.Optional(Boolean),
    archiveType: Match.Optional(Match.OneOf('file', 'doc', 'link')),
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
        case 'archives':
            return searchArchives(searchParameters, userId);
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

function searchArchives(searchParameters, userId) {
    var mongoParameters = [];
    var key = searchParameters.key || '';
    var includeKeyRegex = {
        $regex: key,
        $options: 'i'
    };

    if(searchParameters.advancedSearch){
        if(key){
            if(searchParameters.archiveName){
                mongoParameters.push({
                    name: includeKeyRegex
                });
            }
            if(searchParameters.ownerName){
                mongoParameters.push({
                    owner: includeKeyRegex
                });
            }
        }
    }else{
        mongoParameters = [
            {name: includeKeyRegex}
        ]
    }

    var queryArray = [{$or: mongoParameters}];
    var archiveType = searchParameters.archiveType;
    if(archiveType){
        queryArray.push({type: archiveType});
    }
    if(!searchParameters.deletedArchives){
        queryArray.push({deleted: {$ne: true}});
    }

    var query;
    if(queryArray.length>1){
        query = {$and: queryArray}
    }else{
        query = queryArray
    }

    console.log(mongoParameters);
    console.log(query);

    var result = Archives.find(
        query,{
            fields: {
                owner: 1,
                path: 1,
                name: 1,
                fileId: 1,
                docId: 1,
                deleted: 1,
                type: 1,
                linkType: 1,
                linkId: 1
            }}
    );

    if (result && hasAccessArchives(userId, result)){
        console.log(result.fetch());
        return result;
    }
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

function hasAccessArchives(userId, files){
    if(userId){
        files.forEach(function(file){
            if(!hasAccessArchive(userId, file)){
                return false;
            }
        });

        return true;
    }else{
        return false;
    }
}

function hasAccessArchive(userId, file){
    var fileCommunity = file.community;
    return file.owner === userId || inArray(file.users, userId) || (fileCommunity && hasAccessCommunity(userId, fileCommunity));
}

function hasAccessCommunity(userId, communityId){
    var community = Communities.findOne(communityId, {users: 1});
    if(community.type==='student_group'){
        return inArray(community.users, userId);
    }else{
        return true;
    }
}
