Template.forum.onCreated(function (){
    Meteor.subscribe('communityForum', this.data);
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
    },
    forum: function () {
        return Communities.findOne(Template.instance().data, {forum:1}).forum;
    }

});