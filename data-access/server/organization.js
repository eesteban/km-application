Meteor.publish('organizationInformation', function(){
        var organization =  Organization.find(
            {},
            {fields: {
                information: 1
            }}
        );

        if(organization){
            return organization;
        }

        return this.ready();
});

var informationPattern = {
    description: Match.Optional(String),
    philosophy: Match.Optional(String),
    contact: Match.Optional({
        address: Match.Optional(String),
        phones: Match.Optional([{
            label: String,
            number: String
        }]),
        emails: Match.Optional([{
            label: String,
            email: String
        }])
    })
};

Meteor.methods({
    updateInformation: function (information) {
        check(information, informationPattern);

        var userType = Meteor.user().type;
        if(userType==='admin'){
            Organization.update({}, {$set: {information: information}});
        }
    }
});