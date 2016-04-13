Template.ownFiles.onCreated(function(){
    Meteor.subscribe('userPrivateFiles');
});

Template.ownFiles.helpers({
    files: function () {
        return Meteor.users.findOne(Meteor.userId, {files: 1}).files;
    }
});

Template.ownFiles.events({
    'click #uploadFiles': function(){
        var files = $('#fileInput').prop("files");

        if(files.length>0){
            for (var i = 0, ln = files.length; i < ln; i++) {
                FileStorage.insert(files[i], function (error, fileObj) {
                    if(error){
                        Bert.alert(TAPi18n.__('insert-failure') +': '+ error.message);
                    }else{
                        Meteor.call('addFileUser', fileObj._id);
                    }
                });
            }
            //else if(communityId){
            //    if(Communities.findOne({_id: communityId, users: userId})){
            //        Communities.update(communityId, {$addToSet: {'files': fileId}}, function(error){
            //            if(error){
            //                throw new Meteor.Error('error_insert', TAPi18n.__('insert-failure'));
            //            }
            //        });
            //    }else{
            //        throw new Meteor.Error('error_insert', TAPi18n.__('insert-failure'));
            //    }
            //}

        }else{
            Bert.alert(TAPi18n.__('not_file'), 'warning')
        }
    }

});