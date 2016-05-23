Template.file.onCreated(function () {
    Meteor.subscribe('userFileInformation', this.data.fileId);
});
Template.file.events({
    'click #moveToTrash': function (event) {
        event.preventDefault();
        Meteor.call('moveToTrash', Template.instance().data._id);
    }
});