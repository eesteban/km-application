Template.organizationInformation.onCreated(function(){
   Meteor.subscribe('organizationInformation', function () {
       var organization = Organization.findOne({},{information:1});
       if(organization){
           var information = Session.get('organizationInformation');
           if(!information){
               Session.set('organizationInformation', organization.information);
           }
       }
   })
});

Template.organizationInformation.onRendered(function(){
    $('#addPhoneForm').validate({
        rules:{
            inputPhone: {
                required: true
            },
            inputPhoneLabel: {
                required: true
            }
        },
        messages: {
            inputPhone: {
                required: TAPi18n.__("phone_required")
            },
            inputPhoneLabel: {
                required: TAPi18n.__("label_required")
            }
        },
        submitHandler: function() {
            var phone = {
                number: $('#inputPhone').val(),
                label:   $('#inputPhoneLabel').val()
            };
            
            var information = Session.get('organizationInformation');
            if(!information.contact.phones){
                information.contact.phones = [phone];
            }else{
                information.contact.phones.push(phone);
            }

            Session.set('organizationInformation', information);
        }
    });
    $('#addEmailForm').validate({
        rules:{
            inputOrganizationEmail: {
                required: true,
                email: true
            },
            inputEmailLabel: {
                required: true
            }
        },
        messages: {
            inputOrganizationEmail: {
                required: TAPi18n.__("email_required"),
                email: TAPi18n.__("email_invalid")
            },
            inputEmailLabel: {
                required: TAPi18n.__("label_required")
            }
        },
        submitHandler: function() {
            var email = {
                email:  $('#inputOrganizationEmail').val(),
                label:   $('#inputEmailLabel').val()
            };
            console.log(email);

            var information = Session.get('organizationInformation');
            if(!information.contact.emails){
                information.contact.emails = [email];
            }else{
                information.contact.emails.push(email);
            }

            Session.set('organizationInformation', information);
        }
    })
});

Template.organizationInformation.helpers({
    information: function(){
        return Session.get('organizationInformation');
    }
});

Template.organizationInformation.events({
    'keyup #inputDescr': function(){
        delay(function(){
            var description = $('#inputDescr').val();
            if(description){
                var information = Session.get('organizationInformation');
                information.description = description;
                Session.set('organizationInformation', information);
            }
        }, 500);
    },
    'keyup #inputPhilo': function(){
        delay(function(){
            var philosophy = $('#inputPhilo').val();
            if(philosophy){
                var information = Session.get('organizationInformation');
                information.philosophy = philosophy;
                Session.set('organizationInformation', information);
            }
        }, 500);
    },
    'keyup #inputAddress': function(){
        delay(function(){
            var address = $('#inputAddress').val();
            if(address){
                var information = Session.get('organizationInformation');
                information.contact.address = address;
                Session.set('organizationInformation', information);
            }
        }, 500);
    },
    'submit #addPhoneForm': function(event){
        event.preventDefault();
    }
    ,
    'submit #addEmailForm': function(event){
        event.preventDefault();
    },
    'click .removePhone': function (event){
        event.preventDefault();
        var information = Session.get('organizationInformation');
        var phones = information.contact.phones;
        var phone = this;
        var index = -1;
        for(var i = 0, len = phones.length; i < len; i++) {
            var candidate = phones[i];
            if (phone.label == candidate.label && phone.number == candidate.number) {
                index = i;
                break;
            }
        }
        if(index>=0){
            information.contact.phones.splice(index, 1);
            Session.set('organizationInformation', information);
        }
    },
    'click .removeEmail': function (event){
        event.preventDefault();
        var information = Session.get('organizationInformation');
        var emails = information.contact.emails;
        var email = this;
        var index = -1;
        for(var i = 0, len = emails.length; i < len; i++) {
            var candidate = emails[i];
            if (email.label == candidate.label && email.email == candidate.email) {
                index = i;
                break;
            }
        }
        if(index>=0){
            information.contact.emails.splice(index, 1);
            Session.set('organizationInformation', information);
        }
    },
    'submit #organizationInformationForm': function(event){
        event.preventDefault();

        var originalInformation = Organization.findOne({},{information:1}).information;
        var actualInformation = Session.get('organizationInformation');

        if(originalInformation!=actualInformation){
            Meteor.call('updateInformation', actualInformation, function(error){
                if(error){
                    Bert.alert(TAPi18n.__('update_information_failure'), 'warning');
                }else{
                    Bert.alert(TAPi18n.__('update_information_success'), 'success');
                }
            });
        }else{
            Bert.alert(TAPi18n.__('update_information_failure'), 'warning');
        }
    }
});

var delay = (function(){
    var timer = 0;
    return function(callback, ms){
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
    };
})();