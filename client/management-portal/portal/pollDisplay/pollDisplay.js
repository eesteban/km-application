Template.pollDisplay.onCreated(function(){
    Meteor.subscribe('polls', function(){
        var polls = Polls.find({}).fetch();
        var pollIndex = 0;
        var pollNumber = polls.length-1;

        Session.set('polls', polls);
        Session.set('pollIndex', pollIndex);
        Session.set('pollNumber', pollNumber);
    });
});

Template.pollDisplay.helpers({
    selectedPoll: function(){
        var pollIndex = Session.get('pollIndex');
        return Session.get('polls')[pollIndex];
    }
});

Template.pollDisplay.events({
    'click #previous': function (event) {
        event.preventDefault();
        var pollIndex = Session.get('pollIndex');

        if(pollIndex>0){
            pollIndex = pollIndex-1;
        }else{
            pollIndex = Session.get('pollNumber');
        }

        Session.set('pollIndex', pollIndex)
    },
    'click #next': function (event) {
        event.preventDefault();
        var pollIndex = Session.get('pollIndex');
        var pollNumber = Session.get('pollNumber');

        if(pollIndex<pollNumber){
            pollIndex = pollIndex+1;
        }else{
            pollIndex = 0;
        }

        Session.set('pollIndex', pollIndex)
    }
});