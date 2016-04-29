Template.deletedFile.onCreated(function () {
    Meteor.subscribe('userFileInformation', this.data.fileId);
});

Template.deletedFile.events({
    'click #removeFile': function (event, template) {
        event.preventDefault();

        Meteor.call('removeFile', template.data._id, function(error) {
            if (error) {
                Bert.alert(TAPi18n.__("file_remove_failure"), 'danger')
            } else {
                Bert.alert(TAPi18n.__("file_remove_success"), 'success');
            }
        });
    },
    'click #restoreFile': function (event, template) {
        event.preventDefault();

        Meteor.call('restoreFile', template.data._id, function(error) {
            if (error) {
                Bert.alert(TAPi18n.__("file_restore_failure"), 'danger')
            } else {
                Bert.alert(TAPi18n.__("file_restore_success"), 'success');
            }
        });
    }
});