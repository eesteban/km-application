Meteor.users.allow({
    insert: function () {
        return Meteor.user().type==="admin";
    },
    update: function (userId, user, fields, modifier) {
        if(Meteor.user().type==="admin"){
            return true;
        }else{
            /*If the change modifies the user type deny the change*/
            if(fields.indexOf('type')<0){
                return userId===user._id;
            }else{
                return false
            }
        }
    },
    remove:function(){
        return Meteor.user().type==="admin";
    }
});

Meteor.publish("user", function (userId) {
    var user =  Meteor.users.find(
        {_id: userId},
        {fields: {
            'emails': 1,
            'profile': 1
        }}
    );

    if(user){
        return user;
    }
    return this.ready();
});

Meteor.publish("userData", function () {
    var userId =  this.userId;
    var currentUser =  Meteor.users.find(
        {_id: userId},
        {fields: {
            'username': 1,
            'emails': 1,
            'type': 1,
            'profile': 1
        }}
    );

    if(currentUser){
        return currentUser;
    }
    return this.ready();
});


Meteor.publish("otherUsersBasic", function () {
    var userId = this.userId;
    var otherUserBasic =  Meteor.users.find(
        {_id: { $ne: userId}},
        {fields: {
            'profile.name': 1,
            'profile.surname': 1
        }}
    );

    if(otherUserBasic){
        return otherUserBasic;
    }

    return this.ready();
});

Meteor.publish("otherUsersComplete", function () {
    var userId = this.userId;
    console.log(userId);
    var otherUserComplete =  Meteor.users.find(
        {_id: { $ne: userId}},
        {fields: {
            'emails': 1,
            'profile': 1
        }}
    );

    if(otherUserComplete){
        return otherUserComplete;
    }

    return this.ready();
});