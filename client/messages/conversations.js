Template.conversations.onCreated(function () {
    Session.set('selectedConversation', null);
    Session.set('showArchivedConversations', false);
    Meteor.subscribe('userConversations', 'default');
});

Template.conversations.helpers({
    conversations: function () {
        if(Session.get('showArchivedConversations')){
            return Conversations.find({'users.id': Meteor.userId(), 'users.state': {$in: ['default', 'archive']}});
        }else{
            return Conversations.find({'users.id': Meteor.userId(), 'users.state': 'default'});
        }
    },
    selectedConversation: function () {
        return Session.get('selectedConversation');
    },
    showArchivedConversations: function () {
        return Session.get('showArchivedConversations');
    }
});

Template.conversations.events({
    'click #showArchivedConversations': function (event) {
        event.preventDefault();
        var showArchivedConversations = Session.get('showArchivedConversations');
        Session.set('showArchivedConversations', !showArchivedConversations);

        if(!showArchivedConversations){
            Meteor.subscribe('userConversations', 'archive');
        }
    }
});

