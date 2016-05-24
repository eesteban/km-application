Template.conversationDetails.onRendered(function(){
    $('#newMessage').validate({
        rules:{
            message: {
                required: true
            }
        },
        messages: {
            message: {
                required: TAPi18n.__('required_message_body')
            }
        },
        submitHandler: function() {
            var message = $('#newMessageInput').val();
            var conversationId = Session.get('selectedConversation');
            if(message && message!==''){
                Meteor.call('newMessage', conversationId, message, function(error){
                    if(error){
                        Bert.alert(TAPi18n.__('new_message_failure'), 'danger');
                    }else{
                        Bert.alert(TAPi18n.__('new_message_success'), 'success');
                    }
                });
            }

        }
    })
});

Template.conversationDetails.helpers({
    messages: function () {
        var conversationId = Session.get('selectedConversation');
        var conversation = Conversations.findOne(conversationId, {messages:1});

        if(conversation){
            return conversation.messages;
        }
    }
});

Template.conversationDetails.events({
    'submit #newMessage': function(event){
        event.preventDefault();
    }
});