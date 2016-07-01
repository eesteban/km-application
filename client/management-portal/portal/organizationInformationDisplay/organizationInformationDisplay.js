Template.organizationInformationDisplay.onCreated(function(){
    Meteor.subscribe('organizationInformation')
});

Template.organizationInformationDisplay.helpers({
    information: function(){
        var organization = Organization.findOne({},{information:1});
        if(organization) {
            return organization.information;
        }
    }
});
