Template.newFolder.onRendered(function(){
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
                    $('#newFolder').modal('toggle');
                }
            });
        }
    })
});

Template.newFolder.events({
    'submit #newFolderForm': function(event){
        event.preventDefault();
    }
});