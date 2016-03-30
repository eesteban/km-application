Accounts.onEmailVerificationLink(function(token){
    Accounts.verifyEmail(token, function(){
        Bert.alert('Email verified, thank you!', 'success');
    });
});

Template.myProfile.onCreated(function(){
    this.currentTab = new ReactiveVar("aboutMe");
    Meteor.subscribe("userPrivate");
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
            var userPhones = Meteor.user().profile.phones;
            if(userPhones){
                if(userPhones.indexOf(phone)<0){
                    Meteor.users.update(Meteor.userId(), {$push: {'profile.phones': phone}})
                }else{
                    Bert.alert('That phone is already in the list', 'danger')
                }
            }else{
                Meteor.users.update(Meteor.userId(), {$set: {'profile.phones': [phone]}})
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

Template.myProfile.helpers({
    tab: function() {
        return Template.instance().currentTab.get();
    },
    tabData: function(){
        var tab =  Template.instance().currentTab.get();
        var user = Meteor.users.findOne(Meteor.userId());

        if(user){
            if(tab==='aboutMe'){
                return user.profile;
            } else if(tab==='blog'){
                return user._id;
            } else if(tab==='communityList'){
                return user._id;
            } else if(tab==='messages'){
                return user.messages;
            }
        }
    }
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
    },

    'click .nav-tabs li': function(event, template){
        var currentTab = $(event.target).closest("li");

        currentTab.addClass( "active" );
        $(".nav-tabs li").not( currentTab ).removeClass( "active" );

        template.currentTab.set(currentTab.data( "template" ));
    }
});

