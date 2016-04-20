Template.folder.events({
    'click .element': function () {
        var folderName = Template.instance().data.name;
        var newPath = Session.get('path') + folderName + '/';
        console.log(newPath);
        Meteor.subscribe('userFiles', newPath);
        Meteor.subscribe('userFolders', newPath);
        Session.set('path', newPath);
    }
});