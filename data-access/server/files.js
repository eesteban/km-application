Meteor.publish("userFiles", function(path){
    check(path, String);
    var userId = this.userId;

    if(userId){
        var files =  Files.find(
            {owner: userId,  path: path, deleted: {$ne: true}, removed: {$ne: true}},
            {fields: {
                owner: 1,
                path: 1,
                name: 1,
                fileId: 1,
                docId: 1,
                deleted: 1,
                type: 1,
                users: 1
            }}
        );

        if(files){
            return files;
        }

        return this.ready();
    }else{
        throw new Meteor.Error('logged-out', "Subscription cancelled");
    }
});

Meteor.publish("deletedFiles", function(){
    var userId = this.userId;

    if(userId){
        var files =  Files.find(
            {owner: userId, deleted: true, removed: {$ne: true}},
            {fields: {
                owner: 1,
                path: 1,
                name: 1,
                fileId: 1,
                docId: 1,
                deleted: 1,
                type: 1
            }}
        );

        if(files){
            return files;
        }

        return this.ready();
    }else{
        throw new Meteor.Error('logged-out', "Subscription cancelled");
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

    if(files){
        return files;
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
                name: name,
                type: 'folder'
            };

            Files.insert(folder);
        }else{
            throw new Meteor.Error('logged-out', TAPi18n.__("not_logged_user"));
        }
    },
    newDocument: function (name, path) {
        check(name, String);
        check(path, String);
        var userId = this.userId;

        if(userId){
            var docId = Documents.insert({
                ops: [
                    {insert: "This is your new document.\n"},
                    {insert: "Let's change the world!\n"}
                ]
            });
            console.log('insertedDoc:' + docId);
            var document = {
                owner: userId,
                path: path,
                name: name,
                docId: docId,
                type: 'doc'
            };

            Files.insert(document);
        }else{
            throw new Meteor.Error('logged-out', TAPi18n.__("not_logged_user"));
        }
    },
    newFile: function(fileId, path){
        check(fileId, String);
        check(path, String);
        var userId = Meteor.userId();

        if(userId){
            if(!Files.findOne({fileId: fileId})){
                var file = {
                    path: path,
                    owner: userId,
                    fileId: fileId,
                    deleted:  false,
                    type: 'file'
                };
                Files.insert(file, function(error){
                    if(error){
                        throw new Meteor.Error('error_insert', TAPi18n.__('insert-failure'));
                    }
                });
            }else{
                throw new Meteor.Error('error_insert', TAPi18n.__('insert-failure'));
            }
        }else{
            throw new Meteor.Error('logged-out', "The entry can't be added");
        }
    },
    moveToTrash: function(fileId){
        check(fileId, String);
        var userId = this.userId;

        if(userId){
            Files.update({_id: fileId, owner: userId}, {$set: {deleted: true}});
        }else{
            throw new Meteor.Error('logged-out', TAPi18n.__("not_logged_user"));
        }
    },
    restoreFile: function (fileId) {
        check(fileId, String);
        var userId = this.userId;

        if(userId){
            Files.update({_id: fileId, owner: userId}, {$set: {deleted: false}});
        }else{
            throw new Meteor.Error('logged-out', TAPi18n.__("not_logged_user"));
        }
    },
    removeFile: function (fileId) {
        check(fileId, String);
        var userId = this.userId;

        if(userId){
            Files.update({_id: fileId, owner: userId}, {$set: {removed: true}});
        }else{
            throw new Meteor.Error('logged-out', TAPi18n.__("not_logged_user"));
        }
    },
    shareFile: function (fileId, users) {
        check(fileId, String);
        check(users, [String]);

        var userId = this.userId;

        if(userId){
            users.forEach(function(user){
                Files.update({_id: fileId, owner: userId}, {$addToSet: {users: user}});
            });
        }else{
            throw new Meteor.Error('logged-out', TAPi18n.__("not_logged_user"));
        }
    }
});