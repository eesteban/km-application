Template.newDocument.onRendered(function(){
    $('#newDocumentForm').validate({
        rules:{
            inputName: {
                required: true
            }
        },
        messages: {
            inputName: {
                required: TAPi18n.__('required_name')
            }
        },
        submitHandler: function() {
            var documentName =  $('#inputDocumentName').val();
            var path = Session.get('path');
            var community

            Meteor.call('newDocument', documentName, path, function(error){
                if(error){
                    Bert.alert(TAPi18n.__('new_document_failure'), 'danger');
                }else{
                    Bert.alert(TAPi18n.__('new_document_success'), 'success');
                    $('#newDocument').modal('toggle');
                }
            });
        }
    })
});

Template.newDocument.events({
    'submit #newDocumentForm': function(event){
        event.preventDefault();
    }
});