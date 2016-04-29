Template.newConversation.onRendered(function(){
    $('#newConversationForm').validate({
        rules:{
            inputMessage: {
                required: true
            }
        },
        messages: {
            inputMessage: {
                required: TAPi18n.__('required_message')
            }
        },
        submitHandler: function() {
            var users = [];
            Meteor.users.find({selected:true}, {_id: 1}).forEach(
                function(user){
                    users.push(user._id);
                }
            );

            var message =  $('#inputMessage').val();

            Meteor.call('newConversation', users, message, function(error){
                if(error){
                    Bert.alert(TAPi18n.__('new_conversation_failure'), 'danger');
                }else{
                    Bert.alert(TAPi18n.__('new_conversation_success'), 'success');
                    $('#newConversation').modal('toggle');
                }
            });
        }
    })
});

Template.newConversation.events({
    'submit #newConversationForm': function(event){
        event.preventDefault();
    }
});