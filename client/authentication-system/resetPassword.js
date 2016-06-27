Accounts.onResetPasswordLink(function(token){
    Session.set('resetPasswordToken', token);
});

Template.resetPassword.onRendered(function(){
    $('#resetPasswordForm').validate({
        rules: {
            inputPassword:{
                required: true,
                minlength:8
            },
            inputPasswordConfirmation:{
                equalTo: "#inputPassword"
            }
        },
        messages: {
            inputPassword:{
                required:  TAPi18n.__("password_required"),
                minlength: TAPi18n.__("password_length")
            },
            inputPasswordConfirmation: {
                equalTo: TAPi18n.__("password_confirmation_fail")
            }
        },
        submitHandler: function() {
            var token = Session.get('resetPasswordToken');
            var password = $('#inputPassword').val();
            Accounts.resetPassword(token, password, function(error){
                if(error){
                    Bert.alert(TAPi18n.__('reset_password_failed'), 'danger');
                }
            });
        }
    })
});