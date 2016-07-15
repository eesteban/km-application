Template.changePassword.onRendered(function(){
    $('#changePasswordForm').validate({
        rules: {
            inputOldPassword:{
                required: true,
                minlength:8
            },
            inputNewPassword:{
                required: true,
                minlength:8
            },
            inputPasswordConfirmation:{
                equalTo: "#inputNewPassword"
            }
        },
        messages: {
            inputOldPassword:{
                required:  TAPi18n.__("password_required"),
                minlength: TAPi18n.__("password_length")
            },
            inputNewPassword:{
                required:  TAPi18n.__("password_required"),
                minlength: TAPi18n.__("password_length")
            },
            inputPasswordConfirmation: {
                equalTo: TAPi18n.__("password_confirmation_fail")
            }
        },
        submitHandler: function() {
            var oldPassword = $('#inputOldPassword').val();
            var newPassword = $('#inputNewPassword').val();
            var newPasswordConfirmation = $('#inputPasswordConfirmation').val();
            
            if(newPassword===newPasswordConfirmation){
                Accounts.changePassword(oldPassword, newPassword, function(error){
                    if(error){
                        Bert.alert(TAPi18n.__("password_update_failure"), 'danger');
                    }else{
                        Bert.alert(TAPi18n.__("password_update_success"), 'success');
                    }
                })
            }
        }
    })
});

Template.changePassword.events({
    'submit #changePasswordForm': function(event){
        event.preventDefault();
    }
});