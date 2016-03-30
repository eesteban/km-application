Template.topicGeneral.events({
    'click .forum-topic-header': function(event){
        event.preventDefault();
        Session.set('selectedTopicIndex', Template.instance().data.topicIndex);
    }
});

Template.topicGeneral.helpers({
    topicObject: function(){
        var communityId = Session.get('currentCommunity');
        var topicIndex = Template.instance().data.topicIndex;
        var forum = Communities.findOne(communityId, {fields: {forum: 1}}).forum;
        return forum[topicIndex];
    },
    getLatestPost: function(posts){
        return posts[posts.length-1];
    }
});