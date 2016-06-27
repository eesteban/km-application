Template.blogEntry.helpers({
    isOwner: function(){
        var selectedUser = Session.get('selectedUser');
        return Meteor.userId()===selectedUser;
    }
});

Template.blogEntry.events({
    'click .deleteEntry': function(event){
        event.preventDefault();
        var index = Template.instance().data.index;
        Meteor.call('removeBlogEntry', index);
    }
});