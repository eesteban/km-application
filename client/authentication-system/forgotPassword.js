Template.forgotPassword.onRendered(function(){
    $('#forgotPasswordForm').validate({
        rules:{
            inputEmail: {
                required: true,
                email:true
            }
        },
        messages: {
            inputEmail: {
                required: TAPi18n.__('email_required'),
                email: TAPi18n.__('email_invalid')
            }
        },
        submitHandler: function() {
            var email = $('#inputEmail').val();
            
            Accounts.forgotPassword({
                email: email
            }, function(error){
                if(error){
                    Bert.alert(TAPi18n.__('forgot_password_error'), 'danger');
                }
            });
        }
    })
});

Template.forgotPassword.events({
    'submit #forgotPasswordForm': function(event){
        event.preventDefault();
    }
});