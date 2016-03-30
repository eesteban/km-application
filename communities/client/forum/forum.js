Template.forum.onCreated(function (){
    Session.set('selectedTopicIndex', -1)
});

Template.forum.events({
    'click .forumMainNav': function(event){
        event.preventDefault();
        Session.set('selectedTopicIndex', -1)
    }
});

Template.forum.helpers({
    selectedTopicIndex: function(){
        return Session.get('selectedTopicIndex')>=0;
    }
});