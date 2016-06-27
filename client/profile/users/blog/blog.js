Template.blog.onCreated(function () {
    var selectedUserId = this.data;
    Meteor.subscribe('blog', selectedUserId);
    Session.set('selectedUser', selectedUserId);
});

Template.blog.helpers({
    isOwner: function(){
        var selectedUserId = Session.get('selectedUser');
        return Meteor.userId()===selectedUserId;
    },
    blogEntries: function() {
        var selectedUserId = Session.get('selectedUser');
        var blog = Meteor.users.findOne(selectedUserId, {blog: 1}).blog;
        if (blog) {
            return blog.entries
        }
        return false;
    }
});