PictureStorage.allow({
    insert: function(userId, picture){
        return !!userId;
    },
    update: function(userId, picture, fields, modifier){
        return false;
    },
    remove:function(userId, picture){
        return false;
    },
    download:function(userId, picture){
        return !!userId;
    }
});

Meteor.publish("profilePictureInformation", function (userId) {
    check(userId, Match.Optional(String));

    if(!userId){
        userId = this.userId;
    }

    var profilePicture = Meteor.users.findOne(userId, {'profile.picture': 1}).profile.picture;
    return PictureStorage.find(profilePicture);
});