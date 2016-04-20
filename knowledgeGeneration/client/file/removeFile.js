Template.removeFile.onRendered(function(){
    $('#newFolderForm').validate({
        rules:{
            inputName: {
                required: true
            }
        },
        messages: {
            inputName: {
                required: TAPi18n.__('required_name')
            }
        },
        submitHandler: function() {
            var folderName =  $('#inputFolderName').val();
            var path = Session.get('path');

            Meteor.call('newFolder', folderName, path, function(error){
                if(error){
                    Bert.alert(TAPi18n.__('new_folder_failure'), 'danger');
                }else{
                    Bert.alert(TAPi18n.__('new_folder_success'), 'success');
                    $('#removeFile').modal('toggle');
                }
            });
        }
    })
});

Template.removeFile.events({
    'click #removeFileBtn': function(event, template){
        event.preventDefault();
        var fileId = template.data;
        if (!fileId) {
            Bert.alert(TAPi18n.__("file_remove_failure"), 'warning')
        }else{
            var removed = Files.findOne({fileId: fileId}, {removed:1}).removed;
            console.log(removed);
            if(removed){
                console.log('removed');
                //Meteor.call('removeFile', fileId, function(error){
                //    if(error){
                //        Bert.alert(TAPi18n.__("file_remove_failure"), 'danger')
                //    }else{
                //        Bert.alert(TAPi18n.__("file_remove_success"), 'success');
                //        $('#removeFile').modal('toggle');
                //    }
                //});
            }else{
                Meteor.call('removeFile', fileId, function(error){
                    if(error){
                        Bert.alert(TAPi18n.__("file_remove_failure"), 'danger')
                    }else{
                        Bert.alert(TAPi18n.__("file_remove_success"), 'success');
                        $('#removeFile').modal('toggle');
                    }
                });
            }

        }
    }
});