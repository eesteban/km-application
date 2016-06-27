Template.community.onCreated(function(){
    this.currentTab = new ReactiveVar('forum');
});

Template.community.events({
    'click .navbar-nav li': function(event, template){
        var currentTab = $(event.target).closest("li");
        template.currentTab.set(currentTab.data( "template" ));
    },
    'click #joinCommunity': function(event, template){
        var communityId = template.data.community._id;
        Meteor.call('joinCommunity', communityId);
    }
});

Template.community.helpers({
    tab: function() {
        return Template.instance().currentTab.get();
    },
    tabData: function(){
        var tab = Template.instance().currentTab.get();
        var community = Template.instance().data.community;

        if(community){
            if(tab==='forum'){
                return community._id;
            }else if(tab==='members'){
                return community.users;
            }else if(tab==='communityArchives'){
                return community._id;
            }
        }
    },
    notMember: function () {
        return Template.instance().data.community.users.indexOf(Meteor.userId()) < 1;
    }
});