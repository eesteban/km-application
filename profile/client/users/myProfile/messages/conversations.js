Template.conversations.onCreated(function () {
    Meteor.subscribe('userConversations');
});

Template.conversations.helpers({
    conversations: function () {
        return Conversations.find({'users.id': Meteor.userId()});
    }
});