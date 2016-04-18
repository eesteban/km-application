FileStorage.allow({
    insert: function(userId, file){
        return !!userId;
    },
    update: function(userId, file, fields, modifier){
        return !!userId;
    },
    remove:function(userId, file){
        return !!userId;
    },
    download:function(){
        return true;
    }
});

Meteor.publish("userFilesInformation", function (filesId) {
    check(filesId, [String]);
    var userId = this.userId;

    if(userId) {
        return FileStorage.find({_id: {$in: filesId}});
    }
});