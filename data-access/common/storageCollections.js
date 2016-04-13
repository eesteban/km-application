var fileStore = new FS.Store.GridFS('files', {
    //mongoUrl: 'mongodb://127.0.0.1:27017/test/', // optional, defaults to Meteor's local MongoDB
    //mongoOptions: {...},                        // optional, see note below
    //transformWrite: transformWrite,   //optional
    //transformRead: myTransformReadFunction,     //optional
    maxTries: 1,                                // optional, default 5
    chunkSize: 1024*1024                        // optional, default GridFS chunk size in bytes (can be overridden per file).
                                                // Default: 2MB. Reasonable range: 512KB - 4MB
});

FileStorage = new FS.Collection("files", {
    stores: [fileStore]
});

