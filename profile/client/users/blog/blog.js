Template.blog.onCreated(function () {
    Meteor.subscribe('blog', this.data);
});

Template.blog.helpers({
    isOwner: function(){
        return Meteor.userId()===Template.instance().data;
    },
    blogEntries: function() {
        var userId = Template.instance().data;
        var blog = Meteor.users.findOne(userId, {'blog.entries':1}).blog;
        return blog && blog.entries;
    }
});