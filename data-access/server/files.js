Meteor.publish("userFiles", function(path){
    check(path, String);
    var userId = this.userId;

    if(userId){
        var files =  Files.find(
            {owner: userId,  path: path, deleted: {$ne: true}},
            {fields: {
                owner: 1,
                path: 1,
                name: 1,
                fileId: 1,
                deleted: 1
            }}
        );

        if(files){
            return files;
        }

        return this.ready();
    }else{
        throw new Meteor.Error('logged-out', "The entry can't be added");
    }
});

Meteor.publish("communityFiles", function(path, communityId){
    check(path, String);
    check(communityId, String);

    var files =  Files.find(
        {community: communityId,  path: path},
        {fields: {
            'name': 1,
            'type': 1
        }}
    );

    if(communities){
        return communities;
    }

    return this.ready();
});

Meteor.methods({
    newFolder: function (name, path) {
        check(name, String);
        check(path, String);
        var userId = this.userId;

        if(userId){
            var folder = {
                owner: userId,
                path: path,
                name: name
            };

            Files.insert(folder);
        }else{
            throw new Meteor.Error('logged-out', "The entry can't be added");
        }
    },
    deleteFile: function(fileId){
        check(fileId, String);
        var userId = this.userId;

        if(userId){
            Files.update({fileId: fileId, owner: userId}, {$set: {deleted: true}});
        }else{
            throw new Meteor.Error('logged-out', "The entry can't be added");
        }
    }
});