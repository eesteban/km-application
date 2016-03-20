Meteor.methods({
    'isAdmin': function(){
        return Meteor.user().type==='admin';
    }
});