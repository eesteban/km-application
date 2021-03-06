Template.file.onCreated(function () {
    var archive = this.data;
    var fileId;

    if(archive.type=='link' && archive.linkType=='file'){
        fileId = archive.linkId;
    }else{
        fileId = archive.fileId;
    }

    if(fileId){
        Meteor.subscribe('userFileInformation', fileId);
    }
});

Template.file.helpers({
    targetFileId: function () {
        var archive = Template.instance().data;
        var fileId;

        if(archive.type=='link' && archive.linkType=='file'){
            fileId = archive.linkId;
        }else{
            fileId = archive.fileId;
        }

        if(fileId){
            return fileId;
        }
    },
    originalFileId: function() {
        var archiveId = Template.instance().data._id;
        return archiveId
    }
});

Template.file.events({
    'click #moveToTrash': function (event) {
        event.preventDefault();
        Meteor.call('moveToTrash', Template.instance().data._id);
    }
});