Template.forum.onCreated(function (){
    Session.set('selectedTopic', null)
});

Template.forum.events({
    'click .forumMainNav': function(event){
        event.preventDefault();
        Session.set('selectedTopic', null)
    }
});

Template.forum.helpers({
    selectedTopic: function(){
        return Session.get('selectedTopic');
    }
});