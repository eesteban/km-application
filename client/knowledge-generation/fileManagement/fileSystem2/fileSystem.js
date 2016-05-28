Template.fileSystem2.helpers({
    template: function () {
        return Template.instance().template.get();
    },
    files: function () {
        var path = Session.get('path');
        var communityId = Template.instance().data.communityId;
        if(!communityId){
            return Files.find({owner: Meteor.userId(), path: path,  type:'file', deleted:{$ne: true}});
        }else{
            return Files.find({community: communityId, path: path,  type:'file', deleted:{$ne: true}});
        }
    },
    folders: function () {
        var path = Session.get('path');
        var communityId = Template.instance().data.communityId;
        if(!communityId){
            return Files.find({owner: Meteor.userId(), path: path,  type:'folder'}, {name: 1});
        }else{
            return Files.find({community: communityId, path: path,  type:'folder'}, {name: 1});
        }
    },
    documents: function () {
        var path = Session.get('path');
        var communityId = Template.instance().data.communityId;
        if(!communityId){
            return Files.find({owner: Meteor.userId(), path: path,  type:'doc', deleted:{$ne: true}});
        }else{
            return Files.find({community: communityId, path: path,  type:'doc', deleted:{$ne: true}});
        }
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
                        var communityId = Template.instance().data.communityId;
                        if(!communityId){
                            Meteor.call('newFile', fileObj._id, path);
                        }else{
                            Meteor.call('newCommunityFile', fileObj._id, path);
                        }
                    }
                });
            }
        }else{
            Bert.alert(TAPi18n.__('not_file'), 'warning')
        }
    }
});