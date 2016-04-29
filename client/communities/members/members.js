Template.members.onCreated(function(){
    var communityId = Session.get('currentCommunity');
    Meteor.subscribe('communityUsersBasic', Session.get('currentCommunity'));
});

Template.members.helpers({
    memberList: function(){
        var communityId = Session.get('currentCommunity');
        return Meteor.users.find({communities: communityId});
    }
});