Template.sideNav.events({
    'click #logout': function(){
        Meteor.logout(function(){
            Router.go('/');
        })
    }

});