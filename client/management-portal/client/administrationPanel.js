Template.managementDashboard.events({
    'click #setup': function(event){
        event.preventDefault();
        Meteor.call('fastSetup');
    }
});