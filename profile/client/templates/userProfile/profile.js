var activeAbout = new ReactiveVar('active');
var activeBlog = new ReactiveVar('');
var activeCommunities = new ReactiveVar('');

Template.profile.onRendered(function(){
    activeAbout.set('active');
    activeBlog.set('');
    activeCommunities.set('');
});

Template.profile.events({
    'click #aboutMe_tab': function(event){
        event.preventDefault();
        activeAbout.set('active');
        activeBlog.set('');
        activeCommunities.set('');
    },
    'click #blog_tab': function(event){
        event.preventDefault();
        activeAbout.set('');
        activeBlog.set('active');
        activeCommunities.set('');
    },
    'click #communities_tab': function(event){
        event.preventDefault();
        activeAbout.set('');
        activeBlog.set('');
        activeCommunities.set('active');
    }

});

Template.profile.helpers({
    activeAbout: function(){
        return activeAbout.get();
    },

    activeBlog: function(){
        return activeBlog.get();
    },

    activeCommunities: function(){
        return activeCommunities.get();
    }
});