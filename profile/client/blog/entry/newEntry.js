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
                required: TAPi18n.__('required_title')
            },
            inputBody: {
                required: TAPi18n.__('required_entry_body')
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