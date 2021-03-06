Accounts.onEmailVerificationLink(function(token){
    Accounts.verifyEmail(token, function(){
        Bert.alert('Email verified, thank you!', 'success');
    });
});

Template.myProfile.onCreated(function(){
    this.currentTab = new ReactiveVar('aboutMe');
    Meteor.subscribe("userPrivate");
    Meteor.subscribe("profilePictureInformation");
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
                required: TAPi18n.__("phone_required")
            }
        },
        submitHandler: function() {
            var phone = $('#phone').val();
            var userPhones = Meteor.user().profile.phones;
            if(!userPhones || userPhones.indexOf(phone)<0){
                Meteor.call('addPhone', phone);
            }else{
                Bert.alert(TAPi18n.__("phone_in_list"), 'danger')
            }
        }
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
                required: TAPi18n.__("email_required"),
                email: TAPi18n.__("email_invalid")
            }
        },
        submitHandler: function() {
            var email = $('#email').val();
            var userEmails = Meteor.user().emails;
            if(!userEmails || userEmails.indexOf(email)<0){
                Meteor.call('addEmail', email);
            }else{
                Bert.alert(TAPi18n.__("email_in_list"), 'danger')
            }
        }
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
                return user._id;
            } else if(tab==='ownArchives'){
                return user.files;
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
        var phone =  this.toString();
        Meteor.call('removePhone', phone);
    },
    'click .removeEmail': function (event){
        event.preventDefault();
        if(Meteor.user().emails.length <= 1){
            Bert.alert(TAPi18n.__("last_email"), 'warning');
        }else{
            var email = this.address;
            Meteor.call('removeEmail', email);
        }
    },
    'click .verifyEmail': function (event){
        event.preventDefault();
        var email = this.address;
        Meteor.call('verifyUserEmail', email);
    },
    'click .navbar-nav li': function(event, template){
        var currentTab = $(event.target).closest("li");
        template.currentTab.set(currentTab.data( "template" ));
    }
});

