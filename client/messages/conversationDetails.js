Template.conversationDetails.onRendered(function(){
    $('#newMessage').validate({
        rules:{
            message: {
                required: true
            }
        },
        messages: {
            message: {
                required: TAPi18n.__('body_required')
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
    },
    state: function () {
        var conversationId = Session.get('selectedConversation');
        var conversation = Conversations.findOne(conversationId, {users:1});

        var index = 0;
        var users = conversation.users;
        for(var l=users.length; index<l; index++){
            if(users[index].id===Meteor.userId()){
                return conversation.users[index].state;
            }
        }
    }
});

Template.conversationDetails.events({
    'submit #newMessage': function(event){
        event.preventDefault();
    },
    'click #deleteConversation': function(event){
        event.preventDefault();
        var conversationId = Session.get('selectedConversation');
        Meteor.call('changeConversationState', 'delete', conversationId, function(error){
            if(error){
                Bert.alert(TAPi18n.__('delete_conversation_failure'), 'warning');
            }else{
                Bert.alert(TAPi18n.__('delete_conversation_success'), 'success');
            }
        })
    },
    'click #archiveConversation': function(event){
        event.preventDefault();
        var conversationId = Session.get('selectedConversation');
        Session.set('selectedConversation', null);

        Meteor.call('changeConversationState', 'archive', conversationId, function(error){
            if(error){
                Bert.alert(TAPi18n.__('archive_conversation_failure'), 'warning');
            }else{
                Bert.alert(TAPi18n.__('archive_conversation_success'), 'success');
            }
        })
    },
    'click #recoverConversation': function(event){
        event.preventDefault();
        var conversationId = Session.get('selectedConversation');
        Meteor.call('changeConversationState', 'default', conversationId, function(error){
            if(error){
                Bert.alert(TAPi18n.__('recover_conversation_failure'), 'warning');
            }else{
                Bert.alert(TAPi18n.__('recover_conversation_success'), 'success');
            }
        })
    }
});