Meteor.publish("userConversations", function (state) {
    check(state, Match.OneOf('default', 'archive'));
    var userId = this.userId;

    var conversations =  Conversations.find(
        {users: {
            id: userId,
            state: state
        }},
        {fields: {
            users: 1
        }}
    );

    if(conversations){
        return conversations;
    }

    return this.ready();
});

Meteor.publish("conversation", function (conversationId) {
    check(conversationId, String);
    var userId = this.userId;

    if(userId){
        var conversation =  Conversations.find(
            {_id: conversationId, 'users.id': userId},
            {fields: {
                users: 1,
                messages: 1
            }}
        );

        if(conversation){
            return conversation;
        }

        return this.ready();
    }else{
        throw new Meteor.Error('logged-out', "Subscription cancelled");
    }
});

Meteor.methods({
    newConversation: function (participantIdArray, messageText) {
        var userId = Meteor.userId();
        check(participantIdArray, [String]);
        check(messageText, String);

        if(userId) {
            var users = [userId];
            Meteor.users.find({_id: {$in: participantIdArray}}).forEach(function (user) {
                users.push(user._id)
            });
            
            var message = createMessage(userId, messageText);

            var conversation = Conversations.findOne({'users.id': users}, {_id: 1});
            if(conversation){
                sendMessage(conversation._id, userId, message);
            }else{
                createConversation(users, message);
            }
        }else{
            throw new Meteor.Error('logged-out', TAPi18n.__("conversation_not_created"));
        }
    },
    newMessage: function (conversationId, messageText) {
        var userId = Meteor.userId();
        check(conversationId, String);
        check(messageText, String);

        if(userId) {
            var message = createMessage(userId, messageText);
            sendMessage(conversationId, userId, message);
        }else{
            throw new Meteor.Error('logged-out', TAPi18n.__("message_not_sent"));
        }
    },
    changeConversationState: function(newState, conversationId){
        check(newState, Match.OneOf('default', 'archive','delete'));
        check(conversationId, String);

        var userId = Meteor.userId();
        if(userId) {
            var conversation = Conversations.findOne({_id: conversationId, 'users.id': userId});
            var index = 0;
            var users = conversation.users;
            for(var l=users.length; index<l; index++){
                if(users[index].id===userId){
                    conversation.users[index].state=newState;
                    break;
                }
            }
            Conversations.update(conversationId, conversation, function(error){
                if(error){
                    throw new Meteor.Error('change-status', TAPi18n.__("status_not_updated"));
                }
            });
        }else{
            throw new Meteor.Error('logged-out', TAPi18n.__("change_state"));
        }
    }
});

function createMessage (userId, messageText){
    var date = new Date();
    var formattedDate =  date.getDate() + "/"
        + (date.getMonth()+1)  + "/"
        + date.getFullYear() + " - "
        + date.getHours() + ":"
        + (date.getMinutes()<10?'0':'') + date.getMinutes();
    return {
        message: messageText,
        user: userId,
        date: {
            original: date,
            formatted: formattedDate
        }
    };
}

function sendMessage(conversationId, userId, message){
    Conversations.update({_id: conversationId, 'users.id': userId}, {$addToSet: {messages: message}}, function(error){
        if(error){
            throw new Meteor.Error('send-message', TAPi18n.__("message_not_sent"));
        }
    });
}

function createConversation(users, message){
    var conversation = {
        users: [],
        messages: [message]
    };
    for(var i=0, l=users.length; i<l; i++){
        conversation.users.push({
            id: users[i],
            state: 'default'
        })
    }
    var conversationId = Conversations.insert(conversation);
    if(!conversationId){
        throw new Meteor.Error('create-conversation', TAPi18n.__("conversation_not_created"));
    }
}