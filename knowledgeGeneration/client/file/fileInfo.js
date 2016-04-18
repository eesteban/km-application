Template.fileInfo.events({
    'click #deleteFile':function(event, template) {
        event.preventDefault();
        var fileId = template.data;
        if (!fileId) {
            return false
        }
        Meteor.call('deleteFile', fileId);
        return false;
    }
});