Template.ownFiles.onCreated(function(){
    var path = '/';
    Session.set('path', path);

    Meteor.subscribe('userFiles', path);
});

Template.ownFiles.helpers({
    files: function () {
        var path = Session.get('path');
        var userFiles = [];

        Files.find({owner: Meteor.userId(), path: path,  fileId: {$exists: true}, deleted: false}, {fileId: 1}).forEach(function (file) {
            userFiles.push(file.fileId);
        });

        Meteor.subscribe('userFilesInformation', userFiles);

        return userFiles;
    },
    folders: function () {
        var path = Session.get('path');
        return Files.find({owner: Meteor.userId(), path: path,  name: {$exists: true}}, {name: 1});
    }
});

Template.ownFiles.events({
    'click #uploadFiles': function(){
        var files = $('#fileInput').prop("files");

        if(files.length>0){
            var path = Session.get('path');
            for (var i = 0, ln = files.length; i < ln; i++) {
                FileStorage.insert(files[i], function (error, fileObj) {
                    if(error){
                        Bert.alert(TAPi18n.__('insert-failure') +': '+ error.message);
                    }else{
                        console.log(fileObj._id + ' ' + path);
                        Meteor.call('addFileUser', fileObj._id, path);
                    }
                });
            }
        }else{
            Bert.alert(TAPi18n.__('not_file'), 'warning')
        }
    }
});