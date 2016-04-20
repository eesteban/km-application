Template.ownFiles.onCreated(function(){
    var path = '/';
    Session.set('path', path);

    Meteor.subscribe('userFiles', path);
    this.tmpl = new ReactiveVar('fileSystem');
});

Template.ownFiles.helpers({
    template: function () {
        return Template.instance().tmpl.get();
    },
    path: function(){
        return Session.get('path');
    }
});

Template.ownFiles.events({
    'click #btnFS': function (event, template) {
        template.tmpl.set('fileSystem');
    },
    'click #btnTrash': function (event, template) {
        template.tmpl.set('trash');
    }
});