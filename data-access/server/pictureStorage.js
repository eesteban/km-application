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

    var user = Meteor.users.findOne(userId, {profile: 1});
    if(user){
        return PictureStorage.find(user.profile.picture);
    }

    return this.ready();
});