Template.topicDetailed.helpers({
   selectedTopic: function(){
       var communityId = Session.get('currentCommunity');
       var topicIndex = Session.get('selectedTopicIndex');
       var forum = Communities.findOne(communityId, {fields: {forum: 1}}).forum;
       return forum[topicIndex];
   }
});
