function archive(name, owner, path, communityId){
    return {
        name: name,
        owner: owner,
        path: path,
        users: [],
        communityId: (typeof communityId === 'undefined') ? null : communityId,
        deleted: false
    };
}

function hasAccessMany(userId, files){
    if(userId){
        files.forEach(function(file){
            if(!hasAccess(userId, file)){
                return false;
            }
        });

        return true;
    }else{
        return false;
    }
}

function hasAccess(userId, file){
    var fileCommunity = file.community;
    return file.owner === userId || inArray(file.users, userId) || (fileCommunity && hasAccessToCommunity(userId, fileCommunity));
}

function hasAccessToCommunity(userId, communityId){
    var community = Communities.findOne(communityId, {users: 1});
    if(community.type==='student_group'){
        return inArray(community.users, userId);
    }else{
        return true;
    }
}

Meteor.publish("userArchives", function(path){
    check(path, String);
    var userId = this.userId;

    if(userId){
        var files =  Archives.find(
            {owner: userId, path: path, deleted: {$ne: true}, removed: {$ne: true}},
            {fields: {
                owner: 1,
                path: 1,
                name: 1,
                fileId: 1,
                docId: 1,
                deleted: 1,
                type: 1,
                users: 1,
                linkType: 1,
                linkId: 1
            }}
        );

        if (files && hasAccessMany(userId, files)){
            return files;
        }

        return this.ready();
    }else{
        throw new Meteor.Error('logged-out', "Subscription cancelled");
    }
});

Meteor.publish("communityArchives", function(communityId, path){
    check(communityId, String);
    check(path, String);
    var userId = this.userId;

    if(userId){
        var archives =  Archives.find(
            {communityId: communityId, path: path, deleted: {$ne: true}, removed: {$ne: true}},
            {fields: {
                owner: 1,
                path: 1,
                name: 1,
                fileId: 1,
                docId: 1,
                deleted: 1,
                type: 1,
                users: 1,
                linkType: 1,
                linkId: 1,
                communityId: 1
            }}
        );
        
        if (archives && hasAccessMany(userId, archives)){
            return archives;
        }

        return this.ready();
    }else{
        throw new Meteor.Error('logged-out', "Subscription cancelled");
    }
});


Meteor.publish("deletedArchives", function(){
    var userId = this.userId;

    if(userId){
        var archives =  Archives.find(
            {owner: userId, deleted: true, removed: {$ne: true}},
            {fields: {
                owner: 1,
                path: 1,
                name: 1,
                fileId: 1,
                docId: 1,
                deleted: 1,
                type: 1,
                linkType: 1,
                linkId: 1
            }}
        );

        if(archives && hasAccessMany(userId, archives)){
            return archives
        }

        return this.ready();
    }else{
        throw new Meteor.Error('logged-out', "Subscription cancelled");
    }
});

Meteor.methods({
    newFolder: function (folderName, path, communityId) {
        check(folderName, String);
        check(path, String);
        var userId = Meteor.userId();

        if(userId){
            var folder = archive(folderName, userId, path, communityId);
            folder.type = 'folder';

            Archives.insert(folder, function(error){
                if(error){
                    throw new Meteor.Error('error_insert_folder', TAPi18n.__('insert-failure'));
                }
            });
        }else{
            throw new Meteor.Error('logged-out', TAPi18n.__("not_logged_user"));
        }
    },
    newDocument: function (docName, path, communityId) {
        check(docName, String);
        check(path, String);
        check(communityId, Match.Optional(String));

        var userId = Meteor.userId();
        if(userId){
            var docId = Documents.insert({
                ops: [
                    {insert: "This is your new document.\n"},
                    {insert: "Let's change the world!\n"}
                ]
            });
            console.log('insertedDoc:' + docId);

            var document = archive(docName, userId, path, communityId);
            document.type = 'doc';
            document.docId= docId;
            Archives.insert(document, function(error){
                if(error){
                    throw new Meteor.Error('error_insert_document', TAPi18n.__('insert-failure'));
                }
            });
        }else{
            throw new Meteor.Error('logged-out', TAPi18n.__("not_logged_user"));
        }
    },
    newFile: function(fileName, fileId, fileSize, path, communityId){
        check(fileName, String);
        check(fileId, String);
        check(fileSize, Number);
        check(path, String);
        check(communityId, Match.Optional(String));

        var userId = Meteor.userId();
        if(userId){
            var freeSpace = Meteor.user().storageSpace.free;
            if(fileSize <= freeSpace){
                var file = archive(fileName, userId, path, communityId);
                file.type = 'file';
                file.fileId = fileId;
                file.size = fileSize;
                console.log(file);
                Archives.insert(file, function(error){
                    if(error){
                        throw new Meteor.Error('error_insert_file', TAPi18n.__('insert-failure'));
                    }
                });
            }else{
                throw new Meteor.Error('insufficient-space');
            }
        }else{
            throw new Meteor.Error('logged-out', "The entry can't be added");
        }
    },
    moveToTrash: function(archiveId){
        check(archiveId, String);
        var userId = Meteor.userId();

        if(userId){
            Archives.update({_id: archiveId, owner: userId}, {$set: {deleted: true}});
        }else{
            throw new Meteor.Error('logged-out', TAPi18n.__("not_logged_user"));
        }
    },
    restoreFile: function (fileId) {
        check(fileId, String);
        var userId = this.userId;

        if(userId){
            Archives.update({_id: fileId, owner: userId}, {$set: {deleted: false}});
        }else{
            throw new Meteor.Error('logged-out', TAPi18n.__("not_logged_user"));
        }
    },
    removeFile: function (fileId) {
        check(fileId, String);
        var userId = Meteor.userId();

        if(userId){
            Archives.update({_id: fileId, owner: userId}, {$set: {removed: true}});
        }else{
            throw new Meteor.Error('logged-out', TAPi18n.__("not_logged_user"));
        }
    },
    shareFile: function (fileId, users) {
        check(fileId, String);
        check(users, [String]);

        var userId = Meteor.userId();

        if(userId){
            var file = Archives.get(fileId, {name: 1, type: 1, linkTo: 1});
            if(file){
                if(file.type==='folder'){
                    throw new Meteor.Error('folder_link');
                }else{
                    var link = {
                        name: file.name,
                        path: '/',
                        type: 'link',
                        users: [],
                        deleted: false,
                        linkId: fileId
                    };
                    link.linkType = (file.type === 'link') ? file.linkType : file.type;

                    console.log(link);
                    users.forEach(function(user){
                        link.owner= user;
                        Archives.insert(link, function(error){
                            if(error){
                                throw new Meteor.Error('error_insert_link', TAPi18n.__('insert-failure'));
                            }else{
                                Archives.update(fileId, {$addToSet: {users: user}});
                            }
                        });
                    });
                }
            }else{
                throw new Meteor.Error('non_existing_file');
            }
        }else{
            throw new Meteor.Error('logged-out', TAPi18n.__("not_logged_user"));
        }
    }
});
