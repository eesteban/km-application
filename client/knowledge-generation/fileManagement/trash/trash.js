Template.trash.onCreated(function () {
    Meteor.subscribe('deletedArchives');
});
Template.trash.helpers({
    files: function () {
        return Archives.find({owner: Meteor.userId(),  type:'file', deleted: true});
    },
    documents: function () {
        return Archives.find({owner: Meteor.userId(),  type:'doc', deleted: true});
    }
});