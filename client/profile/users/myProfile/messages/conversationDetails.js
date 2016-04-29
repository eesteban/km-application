Template.conversationDetails.onCreated(function () {
    var conversationId = this.data;
    Meteor.subscribe('conversation', conversationId);
});

Template.conversationDetails.onRendered(function(){
    var conversationId = this.data;

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
            var message = $('#inputMessage').val();
            console.log(message);
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
        var conversation = Conversations.findOne(Template.instance().data, {messages:1});

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