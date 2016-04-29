Template.completeName.onCreated(function () {
    Meteor.subscribe('otherUsersCompleteName', [this.data]);
});

Template.completeName.helpers({
    completeName: function () {
        return Meteor.users.findOne(Template.instance().data, {'profile.completeName': 1}).profile.completeName;
    }
});