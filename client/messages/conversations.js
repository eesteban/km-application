Template.conversations.onCreated(function () {
    Meteor.subscribe('userConversations');
});

Template.conversations.helpers({
    conversations: function () {
        return Conversations.find({'users': Meteor.userId()});
    },
    selectedConversation: function () {
        return Session.get('selectedConversation');
    }
});


