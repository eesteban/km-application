Template.ownArchives.onCreated(function(){
    var path = '/';
    Session.set('path', path);

    Meteor.subscribe('userArchives', path);
    this.tmpl = new ReactiveVar('fileSystem');
});

Template.ownArchives.helpers({
    template: function () {
        return Template.instance().tmpl.get();
    },
    path: function(){
        return Session.get('path');
    }
});

Template.ownArchives.events({
    'click #btnFS': function (event, template) {
        template.tmpl.set('fileSystem');
    },
    'click #btnTrash': function (event, template) {
        template.tmpl.set('trash');
    }
});