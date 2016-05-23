Template.shareModal.onRendered(function () {
    var fileId = this.data._id;
    $('#shareForm').validate({
        submitHandler: function() {
            var selectedUsers = [];
            Meteor.users.find({selected:true}, {_id: 1}).forEach(
                function(user){
                    selectedUsers.push(user._id);
                }
            );

            Meteor.call('shareFile', fileId, selectedUsers, function(error){
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