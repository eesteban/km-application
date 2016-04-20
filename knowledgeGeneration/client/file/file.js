Template.file.events({
    'click #moveToTrash': function (event) {
        event.preventDefault();
        Meteor.call('moveToTrash', Template.instance().data);
    }
});