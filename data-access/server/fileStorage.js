FileStorage.allow({
    insert: function(userId, file){
        return !!userId;
    },
    update: function(userId, file, fields, modifier){
        return hasAccess(userId, file._id);
    },
    remove:function(userId, file){
        return isOwner(userId, file._id);
    },
    download:function(userId, file){
        return hasAccess(userId, file._id);
    }
});

Meteor.publish("userFileInformation", function (fileId) {
    check(fileId, String);
    var userId = this.userId;

    if(userId) {
        return FileStorage.find(fileId);
    }
});

function hasAccess(userId, fileId){
    if(userId){
        var file = Archives.findOne({fileId: fileId}, {owner: 1, users: 1, community: 1});
        if (file) {
            // var fileCommunity = file.community;
            return file.owner === userId /*|| inArray(file.users, userId) || (fileCommunity && hasAccessToCommunity(fileCommunity))*/;
        }else{
            return true
        }

        // var user = Meteor.users.findOne(userId, {communities: 1});
        // if(user){
        //
        //     var userCommunities= user.communities;
        //     var hasAccessToCommunity = !!Archives.find({fileId: fileId, community: {$in : userCommunities}});
        //     return isOwner(userId, fileId) || hasAccessToCommunity;
        // }

    }else{
        return false;
    }
}

//
function isOwner(userId, fileId){
    return userId ? !! Archives.find({fileId: fileId, owner: userId}) : false;
}
//
// function hasAccess(fileId) {
//     var userId = Meteor.userId();
//     var file = Archives.findOne(fileId, {owner: 1, users: 1, community: 1});
//
//     if (userId && file) {
//         var fileCommunity = file.community;
//         return file.owner === userId || inArray(file.users, userId) || (fileCommunity && hasAccessToCommunity(fileCommunity));
//     }else{
//         return false;
//     }
// }
//
// function hasAccessToCommunity(communityId){
//     var community = Communities.findOne(communityId, {users: 1});
//     if(community){
//         if(isStudentGroup(community)){
//             return inArray(community.users, Meteor.userId());
//         }else{
//             return true;
//         }
//     }else{
//         return false;
//     }
// }
//
// function isStudentGroup(community){
//     return community.type==='student_group';
// }