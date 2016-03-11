Template.login.onRendered(function(){
    $('#loginForm').validate({
        rules: {
            inputUsername: {
                required: true,
                minlength: 6
            },
            inputPassword:{
                required: true,
                minlength:8
            }
        },
        messages: {
            inputUsername:  {
                required: "Please specify your Username",
                minlength: "Your username should have at least 6 character"
            },
            inputPassword: {
                required: "We need your Password",
                minlength: "Your password should have at least 8 character"
            }
        },
        submitHandler: function() {
            var username = {
                username: $('#inputUsername').val()
            };
            var password = $('#inputPassword').val();

            Meteor.loginWithPassword(username, password, function(error){
                if(error){
                    Bert.alert('Incorrect login information', 'warning');
                }else{
                    Router.go('/personalProfile');
                }
            })
        },
        success: "valid"
    })
});

Template.login.events({
    'submit form': function (event) {
        event.preventDefault();
    }
});