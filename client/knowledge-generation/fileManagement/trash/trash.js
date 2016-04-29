Template.trash.onCreated(function () {
    Meteor.subscribe('deletedFiles');
});
Template.trash.helpers({
    files: function () {
        return Files.find({owner: Meteor.userId(),  type:'file', deleted: true});
    },
    documents: function () {
        return Files.find({owner: Meteor.userId(),  type:'doc', deleted: true});
    }
});