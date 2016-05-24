if(typeof QuillDrafts === "undefined") {
     QuillDrafts = new Mongo.Collection(null);
}

textChangesListener = function(delta, source) {
    if (source === 'user') {
        var docId = this.template.data.docId;
        QuillDrafts.upsert({docId: docId}, {$addToSet: {modifications: delta}});
        var oldDelta = new Delta($.extend({}, this.template.quillEditor.oldDelta));
        this.template.quillEditor.oldDelta = this.template.quillEditor.oldDelta.compose(delta);
        var doc = Documents.findOne({_id: docId});
        // Check for other new content besides the last keystroke
        var editorContents = this.template.quillEditor.getContents();
        var updateDelta;
        if(oldDelta.compose(delta).diff(editorContents).ops.length > 0) {
            updateDelta = oldDelta.diff(editorContents);
        } else {
            updateDelta = delta;
        }
        Meteor.call("updateDocument", docId, updateDelta, editorContents);
    }
};

Template.quillEditor.onCreated(function() {
    this.quillEditor = {};
    Meteor.subscribe('document', this.data.docId);
});

Template.quillEditor.onRendered(function() {
    var template = this;
    var author = {
        id: Meteor.userId(),
        name: Meteor.user().username
    };

    template.quillEditor = new Quill('#editor-' + template.data.docId, {
        modules: {
            'authorship': {
                authorId: author.name, // should be authorId
                enabled: true
            },
            'toolbar': {
                container: '#toolbar'
            },
            'link-tooltip': true,
            'pdfGenerator': {
                docId: template.data.docId
            }
        },
        theme: 'snow'
    });

    template.quillEditor.template = template;
    template.quillEditor.oldDelta = template.quillEditor.getContents();

    Tracker.autorun(function() {
        var docId = template.data.docId;
        var remoteContents = Documents.findOne({_id: docId});

        if (!remoteContents) {
            remoteContents = new Delta();
        }
        var oldContents = template.quillEditor.oldDelta;
        var remoteChanges = oldContents.diff(remoteContents);
        var editorContents = template.quillEditor.getContents();
        var diff = editorContents.diff(remoteContents);
        var localChanges = oldContents.diff(editorContents);

        if (diff.ops.length > 0) {
            // Make updates, but don't overwrite work in progress in editor
            template.quillEditor.updateContents(localChanges.transform(remoteChanges, 0));
        }

        template.quillEditor.oldDelta = oldContents.compose(remoteChanges);
    });

  // If you want to save on every change, use the text-change event below. We're using a save button
    Tracker.autorun(function() {
        if(Meteor.status().connected) {
            template.quillEditor.on('text-change', textChangesListener);
        }
    });
});

Template.quillEditor.helpers({
    connection: function() {
        var status = Meteor.status().status;
        return {
            connected: function () {
                return (status === "connected")
            },
            connecting: function () {
                return (status === "connecting")
            },
            offline: function () {
                return (status === "offline" || status === "waiting")
            }
        }
    },
    hasEdits: function() {
         var template = Template.instance();
         var unsavedChanges = QuillDrafts.findOne({docId: template.data.docId});
         if(template.quillEditor && unsavedChanges) {
           return unsavedChanges.modifications;
         }
    }
});


Template.quillEditor.events({
    'click .ql-reconnect': function(event) {
        Meteor.reconnect();
    },
    'click #generatePDF': function (event, template){
        event.preventDefault();
        template.quillEditor.getModule('pdfGenerator').generatePDF();
    }
});
