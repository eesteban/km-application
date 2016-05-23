Template.deletedDocument.events({
    'click #removeDocument': function (event, template) {
        event.preventDefault();

        Meteor.call('removeFile', template.data._id, function(error) {
            if (error) {
                Bert.alert(TAPi18n.__("document_remove_failure"), 'danger')
            } else {
                Bert.alert(TAPi18n.__("document_remove_success"), 'success');
            }
        });
    },
    'click #restoreDocument': function (event, template) {
        event.preventDefault();

        Meteor.call('restoreFile', template.data._id, function(error) {
            if (error) {
                Bert.alert(TAPi18n.__("document_restore_failure"), 'danger')
            } else {
                Bert.alert(TAPi18n.__("document_restore_success"), 'success');
            }
        });
    }
});