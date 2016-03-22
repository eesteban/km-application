Accounts.onEnrollmentLink(function(token, done){
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
                required: "Please specify your Username",
                minlength: "Your username should have at least 6 character"
            },
            inputName: {
                required: "Please specify your Name"
            },
            inputSurname:{
                required: "Please specify your Surname"
            },
            inputPassword:{
                required: "We need your Password",
                minlength: "Your password should have at least 8 character"
            },
            inputPasswordConfirmation: {
                required: "Your Password and Password Confirmation must be the same"
            }
        },
        submitHandler: function() {
            var token = Session.get('enrollmentToken');
            var password = $('#inputPassword').val();
            Accounts.resetPassword(token, password, function(error){
                if(error){
                    Bert.alert(TAPi18n.__('enrollment_failure'), 'danger');
                }else{
                    var profile = {
                      name: $('#inputName').val(),
                      surname: $('#inputSurname').val()
                    };
                    var username = $('#inputUsername').val();
                    Meteor.call('updateUser', profile, username, function(error){
                        if(error){
                            Bert.alert('enrollment_failure', 'danger');
                        }else{
                            Router.go('/myProfile');
                        }
                    });
                }
            });
        },
        success: "valid"
    })
});

Template.enrollment.events({
    'submit form': function (event) {
        event.preventDefault();
    }
});
