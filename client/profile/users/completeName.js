Template.completeName.onCreated(function () {
    Meteor.subscribe('otherUsersNames', [this.data]);
});

Template.completeName.helpers({
    user: function () {
        var user = Meteor.users.findOne(Template.instance().data, {'profile.completeName': 1});
        if(user){
            return user;
        }
    }
});
Template.completeName.events({
    'click a': function (event) {
        event.preventDefault();
        var route = $(event.target).attr('href');
        Router.go(route);
    }
});