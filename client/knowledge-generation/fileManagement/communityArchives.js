Template.communityArchives.onCreated(function(){
    var path = '/';
    Session.set('path', path);
    var communityId = (this.data);
    
    Meteor.subscribe('communityArchives', communityId, path);
});

Template.communityArchives.helpers({
    communityId: function () {
        return Session.get('currentCommunity');
    },
    path: function(){
        return Session.get('path');
    }
});
