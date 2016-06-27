Template.postDetailed.events({
    'click .commentPost': function(){
        Session.set('selectedPostIndex', Template.instance().data.postIndex);
    },
    'click .likePost': function(){
        if($.inArray(Template.instance().data.post.usersReacted, Meteor.userId())){
            Bert.alert(TAPi18n.__('already_reacted'), 'warning');
        }else{
            var communityId = Session.get('currentCommunity');
            var topicIndex = Session.get('selectedTopicIndex');
            var postIndex =  Template.instance().data.postIndex;
            Meteor.call('reactToPost', communityId, topicIndex, postIndex, 'likes');
        }
    },
    'click .dislikePost': function(){
        var usersReacted = Template.instance().data.post.usersReacted;
        if(usersReacted && $.inArray(usersReacted, Meteor.userId())){
            Bert.alert(TAPi18n.__('already_reacted'), 'warning');
        }else{
            var communityId = Session.get('currentCommunity');
            var topicIndex = Session.get('selectedTopicIndex');
            var postIndex =  Template.instance().data.postIndex;
            Meteor.call('reactToPost', communityId, topicIndex, postIndex, 'dislikes');
        }
    }
});