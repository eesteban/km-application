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

Meteor.publish("userPrivateFiles", function () {
    var userId = this.userId;

    if(userId){
        var userFiles = Meteor.users.findOne(userId, {fields: {files: 1}}).files;
        return FileStorage.find({_id: {$in: userFiles}});
    }else{
        throw new Meteor.Error('logged-out', "The entry can't be added");
    }
});