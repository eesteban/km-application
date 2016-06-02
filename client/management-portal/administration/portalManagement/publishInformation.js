Template.publishInformation.onRendered(function(){
    $('#publicationForm').validate({
        rules:{
            inputTitle: {
                required: true
            },
            inputBody: {
                required: true
            },
            inputType: {
                required: true
            }
        },
        messages: {
            inputTitle: {
                required: TAPi18n.__('required_title')
            },
            inputBody: {
                required: TAPi18n.__('required_body')
            },
            inputType:{
                required: TAPi18n.__('required_type')
            }
        },
        submitHandler: function() {
            var publication = {
                title: $('#inputTitle').val(),
                body: $('#inputBody').val(),
                type: $('#inputType').val()
            };

            Meteor.call('newPublication',publication, function(error){
                if(error){
                    Bert.alert(TAPi18n.__('publish_information_failure'), 'danger');
                }else{
                    Bert.alert(TAPi18n.__('publish_information_success'), 'success');
                }
            });
        }
    })
});