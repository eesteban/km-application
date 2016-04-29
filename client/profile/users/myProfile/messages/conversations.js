Template.conversations.onCreated(function () {
    Meteor.subscribe('userConversations');
    this.selectedConversation = new ReactiveVar();
});

Template.conversations.helpers({
    conversations: function () {
        return Conversations.find({'users': Meteor.userId()});
    },
    selectedConversation: function () {
        return Template.instance().selectedConversation.get();
    }
});

Template.conversations.events({
    'click .conversationInfo': function (event, template) {
        event.preventDefault();
        var conversationId = $(event.target).attr('id');
        template.selectedConversation.set(conversationId);
    }
});
