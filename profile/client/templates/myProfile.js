Accounts.onEmailVerificationLink(function(token, done){
    Accounts.verifyEmail(token, function(){
        Bert.alert('Email verified, thank you!', 'success');
    });
});

Template.myProfile.onRendered(function(){
    $("#newPhone").validate({
        rules:{
            phone: {
                required: true
            }
        },
        messages: {
            phone: {
                required: "Please specify a new phone"
            }
        },
        submitHandler: function() {
            var phone = $('#phone').val();
            if(Meteor.user().phones){
                if(Meteor.user().phones.indexOf(phone)<0){
                    Meteor.users.update(Meteor.userId(), {$push: {phones: phone}})
                }else{
                    Bert.alert('That phone is already in the list', 'danger')
                }
            }else{
                Meteor.users.update(Meteor.userId(), {$set: {phones: [phone]}})
            }

        },
        errorLabelContainer: '#errorMessagePhone'
    });
    $("#newEmail").validate({
        rules:{
            email: {
                required: true,
                email:true
            }
        },
        messages: {
            email: {
                required: "Please specify a new email",
                email: "Introduce a valid email address please (email@example.com)"
            }
        },
        submitHandler: function() {
            var email = $('#email').val();
            Meteor.call('addEmail', email);
        },
        errorLabelContainer: '#errorMessageEmail'
    });
});

Template.myProfile.events({
    'submit #newPhone': function (event) {
        event.preventDefault();
    },
    'submit #newEmail': function (event) {
        event.preventDefault();
    },
    'click .removePhone': function (event){
        event.preventDefault();
        Meteor.users.update(Meteor.userId(), {$pull: {phones: this.toString()}});
    },
    'click .removeEmail': function (event){
        event.preventDefault();
        if(Meteor.user().emails.length <= 1){
            Bert.alert("You can't delete your last Email address", 'warning');
        }else{
            Meteor.call('removeEmail', this.address);
        }
    }
});

