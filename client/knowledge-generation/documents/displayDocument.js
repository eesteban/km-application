Template.displayDocument.helpers({
    documentName: function () {
        var docId = Session.get('selectedDocument');
        var doc = Archives.findOne({$or: [
            {docId: docId},
            {linkId: docId}
        ]});
        if(doc){
            return doc.name;
        }
    }
});