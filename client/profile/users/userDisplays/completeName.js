Template.completeName.onCreated(function () {
    var userId = this.data;
    Meteor.subscribe('otherUsersNames', [userId]);
});

Template.completeName.helpers({
    user: function () {
        var userId = Template.instance().data;
        var user = Meteor.users.findOne(userId, {'profile.completeName': 1});
        if(user){
            return user;
        }
    },
    userURL: function(){
        var userId = Template.instance().data;
        if(Meteor.userId()===userId){
            return "/myProfile";
        }else{
            return "/profile/"+userId;
        }
    }
});
Template.completeName.events({
    'click a': function (event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        var route = $(event.target).attr('href');
        Router.go(route);
    }
});