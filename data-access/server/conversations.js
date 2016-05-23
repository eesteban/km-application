Meteor.publish("userConversations", function () {
    var userId = this.userId;
    var conversations =  Conversations.find(
        {'users': userId},
        {fields: {
            'users': 1
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
            {_id: conversationId, users: userId},
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
    newConversation: function (participantIdArray, message) {
        var userId = Meteor.userId();
        check(participantIdArray, [String]);
        check(message, String);

        if(userId) {
            var user = Meteor.user();
            var users = [userId];
            Meteor.users.find({_id: {$in: participantIdArray}}).forEach(function (user) {
                users.push(user._id)
            });

            var date = new Date();
            var formattedDate =  date.getDate() + "/"
                + (date.getMonth()+1)  + "/"
                + date.getFullYear() + " - "
                + date.getHours() + ":"
                + (date.getMinutes()<10?'0':'') + date.getMinutes();
            var conversation = {
                users: users,
                messages: [{
                    message: message,
                    user: userId,
                    date: {
                        original: date,
                        formatted: formattedDate
                    }
                }]
            };

            var conversationId = Conversations.insert(conversation);
            if(!conversationId){
                throw new Meteor.Error('create-conversation', TAPi18n.__("conversation_not_created"));
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
            var date = new Date();
            var formattedDate =  date.getDate() + "/"
                + (date.getMonth()+1)  + "/"
                + date.getFullYear() + " - "
                + date.getHours() + ":"
                + (date.getMinutes()<10?'0':'') + date.getMinutes();
            var message = {
                message: messageText,
                user: userId,
                date: {
                    original: date,
                    formatted: formattedDate
                }
            };

            Conversations.update({_id: conversationId, users: userId}, {$addToSet: {messages: message}}, function(error){
                if(error){
                    throw new Meteor.Error('send-message', TAPi18n.__("message_not_sent"));
                }
            });
        }else{
            throw new Meteor.Error('logged-out', TAPi18n.__("conversation_not_created"));
        }
    }
});