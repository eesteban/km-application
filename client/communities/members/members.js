Template.members.onCreated(function(){
    var communityId = Session.get('currentCommunity');
    Meteor.subscribe('communityUsersBasic', communityId);
});

Template.members.helpers({
    memberList: function(){
        var communityId = Session.get('currentCommunity');
        return Communities.findOne(communityId, {users:1}).users;
    }
});