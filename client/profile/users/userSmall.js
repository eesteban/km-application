Template.userSmall.onCreated(function () {
    var userInfo = this.data;
    if(typeof userInfo == 'string'){
        var user = Meteor.users.findOne(userInfo);
        if(user){
            Meteor.subscribe("profilePictureInformation", userInfo);
            return user;
        }
    }else{
        Meteor.subscribe("profilePictureInformation", userInfo._id);
        return userInfo;
    }
});
Template.userSmall.helpers({
    user: function(){
        var userInfo = Template.instance().data;
        if(typeof userInfo == 'string'){
            var user = Meteor.users.findOne(userInfo);
            if(user){
                return user;
            }
        }else{
            return userInfo;
        }
    }
});