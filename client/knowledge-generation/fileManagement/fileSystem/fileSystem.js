Template.fileSystem.helpers({
    template: function () {
        return Template.instance().template.get();
    },
    files: function () {
        var path = Session.get('path');
        return Files.find({owner: Meteor.userId(), path: path,  type:'file', deleted:{$ne: true}});
    },
    folders: function () {
        var path = Session.get('path');
        return Files.find({owner: Meteor.userId(), path: path,  type:'folder'}, {name: 1});
    },
    documents: function () {
        var path = Session.get('path');
        return Files.find({owner: Meteor.userId(), path: path,  type:'doc', deleted:{$ne: true}}, {name: 1});
    }
});

Template.fileSystem.events({
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
                        Meteor.call('newFile', fileObj._id, path);
                    }
                });
            }
        }else{
            Bert.alert(TAPi18n.__('not_file'), 'warning')
        }
    }
});