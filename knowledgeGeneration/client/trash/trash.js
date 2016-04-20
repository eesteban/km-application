Template.trash.onCreated(function () {
    Meteor.subscribe('deletedFiles');
});
Template.trash.helpers({
    files: function () {
        var userFiles = [];

        Files.find({owner: Meteor.userId(),  fileId: {$exists: true}, deleted: true}, {fileId: 1}).forEach(function (file) {
            userFiles.push(file.fileId);
        });

        Meteor.subscribe('userFilesInformation', userFiles);

        return userFiles;
    }
});