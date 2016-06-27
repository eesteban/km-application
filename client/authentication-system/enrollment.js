Accounts.onEnrollmentLink(function(token){
    Session.set('enrollmentToken', token);
});

Template.enrollment.onRendered(function(){
    $('#enrollmentForm').validate({
        rules: {
            inputUsername: {
                required: true,
                minlength: 6
            },
            inputName: {
                required: true
            },
            inputSurname:{
                required: true
            },
            inputPassword:{
                required: true,
                minlength:8
            },
            inputPasswordConfirmation:{
                equalTo: "#inputPassword"
            }
        },
        messages: {
            inputUsername:  {
                required: TAPi18n.__("username_required"),
                minlength: TAPi18n.__("username_length")
            },
            inputName: {
                required: TAPi18n.__("surname_required")
            },
            inputSurname:{
                required:  TAPi18n.__("name_required")
            },
            inputPassword:{
                required:  TAPi18n.__("password_required"),
                minlength: TAPi18n.__("password_length")
            },
            inputPasswordConfirmation: {
                equalTo: TAPi18n.__("password_confirmation_fail")
            }
        },
        submitHandler: function() {
            var token = Session.get('enrollmentToken');
            var password = $('#inputPassword').val();
            Accounts.resetPassword(token, password, function(error){
                if(error){
                    Bert.alert(TAPi18n.__('enrollment_failed'), 'danger');
                }else{
                    var username = $('#inputUsername').val();
                    var name = $('#inputName').val();
                    var surname = $('#inputSurname').val();

                    Meteor.call('enrollUser', username, name, surname, function(error){
                        if(error){
                            Bert.alert('enrollment_failed', 'danger');
                        }else{
                            Session.set('enrollmentToken', null);
                            Router.go('/myProfile');
                        }
                    });
                }
            });
        }
    })
});

Template.enrollment.events({
    'submit form': function (event) {
        event.preventDefault();
    }
});
