Template.conversationInfo.events({
    'click .conversationInfo': function (event) {
        event.preventDefault();
        var conversationId = $(event.target).closest('li').attr('id');
        Session.set('selectedConversation', conversationId);
        Meteor.subscribe('conversation', conversationId);
    }
});