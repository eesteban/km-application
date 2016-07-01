Template.folder.events({
    'click .element': function () {
        var folderName = Template.instance().data.name;
        var newPath = Session.get('path') + folderName + '/';
        var communityId =  Session.get('communityFS');

        if(communityId){
            Meteor.subscribe('communityArchives', communityId, newPath);
        }else{
            Meteor.subscribe('userArchives', newPath);
        }
        Session.set('path', newPath);
    }
});