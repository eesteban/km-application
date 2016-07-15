Template.removeFile.events({
    'click #removeFileBtn': function(event, template){
        event.preventDefault();
        var fileId = template.data;

        Meteor.call('removeFile', fileId, function(error){
            if(error){
                Bert.alert(TAPi18n.__("remove_failure"), 'danger')
            }else{
                Bert.alert(TAPi18n.__("remove_success"), 'success');
                $('#removeFile').modal('hide');
            }
        });
    }
});