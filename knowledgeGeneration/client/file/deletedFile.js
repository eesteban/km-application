Template.deletedFile.events({
    'click #removeFile': function (event) {
        event.preventDefault();
        Meteor.call('removeFile', Template.instance().data);
    },
    'click #restoreFile': function (event) {
        event.preventDefault();
        Meteor.call('restoreFile', Template.instance().data);
    }
});