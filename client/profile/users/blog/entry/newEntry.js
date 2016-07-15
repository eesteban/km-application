Template.newEntry.onRendered(function(){
    $('#newEntryForm').validate({
        rules:{
            inputTitle: {
                required: true
            },
            inputBody: {
                required: true
            }
        },
        messages: {
            inputTitle: {
                required: TAPi18n.__('title_required')
            },
            inputBody: {
                required: TAPi18n.__('body_required')
            }
        },
        submitHandler: function() {
            var title =  $('#inputTitle').val();
            var body = $('#inputBody').val();

            Meteor.call('newEntry', title, body, function(error){
                if(error){
                    Bert.alert(TAPi18n.__('new_entry_failure'), 'danger');
                }else{
                    Bert.alert(TAPi18n.__('new_entry_success'), 'success');
                    $('#newEntry').modal('toggle');
                }
            });
        }
    })
});

Template.newEntry.events({
    'submit #newEntryForm': function(event){
        event.preventDefault();
    }
});