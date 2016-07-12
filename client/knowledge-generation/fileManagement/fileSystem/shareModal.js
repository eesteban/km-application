Template.shareModal.onRendered(function () {
    var archiveId = this.data._id;
    $('#shareForm_'+archiveId).validate({
        submitHandler: function() {
            var selectedUsers = [];
            Meteor.users.find({selected:true}, {_id: 1}).forEach(
                function(user){
                    selectedUsers.push(user._id);
                }
            );

            console.log('submit share');
            console.log(selectedUsers);
            Meteor.call('shareArchive', archiveId, selectedUsers, function(error){
                if(error){
                    Bert.alert(TAPi18n.__('share_failure'), 'danger');
                }else{
                    Bert.alert(TAPi18n.__('share_success'), 'success');
                    $('#shareModal').modal('toggle');
                }
            });
        }
    })
});

Template.shareModal.events({
    'click #share': function (event) {
        event.preventDefault();
        $('#shareForm').submit();
    }
});