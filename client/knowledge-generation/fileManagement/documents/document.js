Template.document.events({
    'click #moveToTrash': function (event) {
        event.preventDefault();
        Meteor.call('moveToTrash', Template.instance().data._id);
    },
    'click #displayDocument': function () {
        var archive = Template.instance().data;
        var docId;
        if(archive.type=='doc'){
            docId = archive.docId;
        }else if (archive.type=='link' && archive.linkType=='doc'){
            docId = archive.linkId;
        }
        if(docId){
            console.log('DocId: '+docId);
            Meteor.subscribe('document', docId, function(error){
                if(!error){
                    Session.set('selectedDocument', docId);
                }
            });
        }
    }
});