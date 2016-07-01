Communities = new Mongo.Collection("communities");
Students = new Mongo.Collection("students");
Archives = new Mongo.Collection("archives");
Conversations = new Mongo.Collection("conversations");
Documents = new Mongo.Collection("documents");
Publications = new Mongo.Collection("publications");
Organization = new Mongo.Collection("organization");
Polls = new Mongo.Collection("polls");

UserIndex = new EasySearch.Index({
    collection: Meteor.users,
    fields: ['profile.name', 'profile.surname', 'profile.completeName','emails'],
    engine: new EasySearch.Minimongo()
});

CommunityIndex = new EasySearch.Index({
    collection: Communities,
    fields: ['name'],
    engine: new EasySearch.Minimongo()
});

StudentIndex = new EasySearch.Index({
    collection: Students,
    fields: ['profile.name', 'profile.surname', 'profile.completeName'],
    engine: new EasySearch.Minimongo()
});

fileStore = new FS.Store.GridFS('fileStore', {
    //mongoUrl: 'mongodb://127.0.0.1:27017/test/', // optional, defaults to Meteor's local MongoDB
    //mongoOptions: {...},                        // optional, see note below
    //transformWrite: transformWrite,   //optional
    //transformRead: myTransformReadFunction,     //optional
    maxTries: 1,                                // optional, default 5
    chunkSize: 1024*1024                        // optional, default GridFS chunk size in bytes (can be overridden per file).
                                                // Default: 2MB. Reasonable range: 512KB - 4MB
});

FileStorage = new FS.Collection("fileStorage", {
    stores: [fileStore]
});


pictureStore = new FS.Store.GridFS('pictureStore', {
    //mongoUrl: 'mongodb://127.0.0.1:27017/test/', // optional, defaults to Meteor's local MongoDB
    //mongoOptions: {...},                        // optional, see note below
    //transformWrite: transformWrite,   //optional
    //transformRead: myTransformReadFunction,     //optional
    maxTries: 1,                                // optional, default 5
    chunkSize: 1024*1024                        // optional, default GridFS chunk size in bytes (can be overridden per file).
                                                // Default: 2MB. Reasonable range: 512KB - 4MB
});

PictureStorage = new FS.Collection("pictureStorage", {
    stores: [pictureStore],
    filter: {
        maxSize: 1048576, // in bytes
        allow: {
            contentTypes: ['image/*'],
            extensions: ['jpg', 'png', 'jpeg']
        },
        onInvalid: function (message) {
            if (Meteor.isClient) {
                Bert.alert(message);
            } else {
                console.log(message);
            }
        }
    }
});
