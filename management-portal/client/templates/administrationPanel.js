Template.administrationPanel.events({
    'click #setup': function(event){
        event.preventDefault();
        Meteor.call('communitySetup');
    }
});