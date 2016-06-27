Template.fileSystem.onCreated(function () {
    if(this.data && this.data.communityId){
        Session.set('communityFS', this.data.communityId);
    }else{
        Session.set('communityFS', null);
    }
});

Template.fileSystem.helpers({
    archives: function (type) {
        var path = Session.get('path');
        var communityId = Session.get('communityFS');
        var query1 = {
            path: path,
            deleted:{$ne: true}
        };

        if(communityId){
            query1.communityId = communityId;
        }else{
            query1.owner =  Meteor.userId()
        }
        var query2 = {
            $or: [{
                type: type
            },{
                type: 'link',
                linkType: type
            }]
        };
        return Archives.find({$and: [query1, query2]});
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
                        //TODO:when create communityFS UPDATE THIS PART
                        var communityId = Session.get('communityFS') || undefined;
                        Meteor.call('newFile', fileObj.name(), fileObj._id, fileObj.size(), path, communityId);
                    }
                });
            }
        }else{
            Bert.alert(TAPi18n.__('not_file'), 'warning')
        }
    }
});