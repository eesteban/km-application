Template.document.events({
    'click #moveToTrash': function (event) {
        event.preventDefault();
        Meteor.call('moveToTrash', Template.instance().data._id);
    }
});