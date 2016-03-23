Template.topicGeneral.events({
    'click .forum-topic-header': function(event){
        event.preventDefault();
        var selectedTopic = Template.instance().data;
        Session.set('selectedTopic', selectedTopic);
    }
});

Template.topicGeneral.helpers({
    getLatestPost: function(posts){
        return posts[posts.length-1];
    }
});