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
                required: TAPi18n.__("username_required"),
                minlength: TAPi18n.__("username_length")
            },
            inputPassword: {
                required: TAPi18n.__("password_required"),
                minlength: TAPi18n.__("password_length")
            }
        },
        submitHandler: function() {
            var username = {
                username: $('#inputUsername').val()
            };
            var password = $('#inputPassword').val();

            Meteor.loginWithPassword(username, password, function(error){
                if(error){
                    Bert.alert(TAPi18n.__("login_failed"), 'warning');
                }else{
                    Router.go('/myProfile');
                }
            })
        }
    })
});

Template.login.events({
    'submit form': function (event) {
        event.preventDefault();
    },
    'click #resetPassword': function(event){
        event.preventDefault();
    }
});