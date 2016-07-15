Template.deletedFile.onCreated(function () {
    Meteor.subscribe('userFileInformation', this.data.fileId);
});

Template.deletedFile.events({
    'click #removeFile': function (event, template) {
        event.preventDefault();

        Meteor.call('removeFile', template.data._id, function(error) {
            if (error) {
                Bert.alert(TAPi18n.__("remove_failure"), 'danger')
            } else {
                Bert.alert(TAPi18n.__("remove_success"), 'success');
            }
        });
    },
    'click #restoreFile': function (event, template) {
        event.preventDefault();

        Meteor.call('restoreFile', template.data._id, function(error) {
            if (error) {
                Bert.alert(TAPi18n.__("restore_failure"), 'danger')
            } else {
                Bert.alert(TAPi18n.__("restore_success"), 'success');
            }
        });
    }
});