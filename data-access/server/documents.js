function hasAccessMany(userId, files){
    if(userId){
        files.forEach(function(file){
            if(!hasAccess(userId, file)){
                return false;
            }
        });

        return true;
    }else{
        return false;
    }
}

function hasAccess(userId, archive){
    return archive.owner === userId || inArray(archive.users, userId);
}

Meteor.publish('document', function (docId) {
    check(docId, String);
    var userId = this.userId;
    console.log('Subscribe to: '+docId);

    if(userId){
        var archives =  Archives.find({
            $and: [
                {docId: docId},
                {$or: [
                    {
                        owner: userId
                    },
                    {
                        users: userId
                    }
                ]}
            ]
        });

        if (archives && hasAccess(userId, archives)){
            var document = Documents.find(docId);

            if(document){
                return document;
            }
        }
        return this.ready();
    }else{
        throw new Meteor.Error('logged-out', "Subscription cancelled");
    }
});

QuillStacks = new Mongo.Collection('quillStacks');

Meteor.methods({
    updateDocument: function(docId, delta, index) {
        var userId = Meteor.userId();
        check(docId, String);
        check(delta, Object);
        check(index, Object);

        if(userId){
            var archives =  Archives.find({
                $and: [
                    {docId: docId},
                    {$or: [
                        {
                            owner: userId
                        },
                        {
                            users: userId
                        }
                    ]}
                ]
            });

            if (archives && hasAccess(userId, archives)){
                var document = Documents.findOne(docId);
                if(document){
                    var stack = QuillStacks.findOne({docId: docId});
                    if(typeof stack === "undefined"){
                        var startDelta = new Delta(document);
                        stack = QuillStacks.insert({
                            docId: docId,
                            stack: [startDelta]
                        });
                        stack = QuillStacks.findOne({docId: docId});
                    }

                    var oldContent = new Delta(stack.stack[stack.stack.length - 1]);

                    if(index < stack.currentIndex) {
                        // More updates have taken place since method was called, so we need to
                        // transform our delta to ensure we're not overwriting other work.
                        console.log("handling out-of-turn delta");
                        var newDelta = new Delta(delta);
                        for(var i = index; i <= stack.currentIndex; i++) {
                            var last = new Delta(stack.stack[i]);
                            newDelta = last.transform(newDelta, 1);
                        }
                        content = oldContent.compose(newDelta);
                    } else {
                        content = oldContent.compose(delta);
                    }

                    var stackUpdate;
                    if(stack.stack && stack.stack.length) {
                        stackUpdate = {
                            $push: {
                                stack: {
                                    $each: [content],
                                    $slice: -5
                                }
                            }
                        };
                    } else {
                        stackUpdate = {
                            $set: [{
                                stack: content
                            }]
                        };
                    }

                    QuillStacks.update(stack._id, stackUpdate);

                    Documents.update({_id: docId}, {$set: {ops: content.ops}});
                }else {
                    throw new Meteor.Error('not-document', TAPi18n.__("document_not_updated"));
                }
            }
        }else{
            throw new Meteor.Error('logged-out', TAPi18n.__("document_not_updated"));
        }
    },
    generatePDF: function(html, docId){
        check(html, String);
        check(docId, String);
        console.log('html');
        console.log(html);
        var pdf = wkhtmltopdf(html, { output: docId+'.pdf' }, function (error, stream) {
            if(error){
                console.log(error);
                //throw new Meteor.Error('generate-pdf', TAPi18n.__("pdf-not-generated"));
            }else{
                console.log(stream);
                // do whatever with the stream
            }
        });
    }
});
