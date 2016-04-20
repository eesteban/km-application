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

Meteor.publish("userFilesInformation", function (filesId) {
    check(filesId, [String]);
    var userId = this.userId;

    if(userId) {
        return FileStorage.find({_id: {$in: filesId}});
    }
});

function hasAccess(userId, fileId){
    if(userId){
        var userCommunities = Meteor.users.findOne(userId, {communities: 1}).communities;
        var hasAccessToCommunity = !!Files.find({fileId: fileId, community: {$in : userCommunities}});
        return isOwner(userId, fileId) || hasAccessToCommunity;
    }else{
        return false;
    }
}

function isOwner(userId, fileId){
    return userId ? !!Files.find({fileId: fileId, owner: userId}) : false;
}