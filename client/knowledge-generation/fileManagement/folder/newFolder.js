Template.newFolder.onRendered(function(){
    $('#newFolderForm').validate({
        rules:{
            inputName: {
                required: true
            }
        },
        messages: {
            inputName: {
                required: TAPi18n.__('name_required')
            }
        },
        submitHandler: function() {
            var folderName =  $('#inputFolderName').val();
            var path = Session.get('path');
            var communityId =  Session.get('communityFS');

            Meteor.call('newFolder', folderName, path, communityId, function(error){
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