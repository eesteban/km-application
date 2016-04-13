Template.users.helpers({
    users : function() {
        return Meteor.users.find({_id: {$ne: Meteor.userId()}}, {profile: 1});
    }
});