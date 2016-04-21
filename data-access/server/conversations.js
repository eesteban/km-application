Meteor.publish("userConversations", function () {
    var userId = this.userId;
    var conversations =  Conversations.find(
        {'users.id': userId},
        {fields: {
            'users': 1
        }}
    );

    if(conversations){
        return conversations;
    }

    return this.ready();
});

Meteor.methods({
    newConversation: function (participantIdArray, message) {
        var userId = Meteor.userId();
        check(participantIdArray, [String]);
        check(message, String);

        if(userId) {
            var user = Meteor.user();
            var users =[{
                id: userId,
                name: user.profile.name + ' ' +user.profile.surname
            }];
            Meteor.users.find({_id: {$in: participantIdArray}}).forEach(function (user) {
                users.push({
                    id: user._id,
                    name: user.profile.name + ' ' +user.profile.surname
                })
            });

            var conversation = {
                users: users,
                messages: [message]
            };

            var conversationId = Conversations.insert(conversation);
            if(!conversationId){
                throw new Meteor.Error('create-conversation', TAPi18n.__("conversation_not_created"));
            }


        }else{
            throw new Meteor.Error('logged-out', TAPi18n.__("conversation_not_created"));
        }
    }
});