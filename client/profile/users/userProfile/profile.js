Template.profile.onCreated(function(){
    this.currentTab = new ReactiveVar('aboutUser');
});

Template.profile.helpers({
    tab: function() {
        return Template.instance().currentTab.get();
    },
    tabData: function(){
        var tab = Template.instance().currentTab.get();
        var user = Template.instance().data.user;

        if(user){
            if(tab==='aboutUser'){
                return user.profile;
            }else if(tab==='blog'){
                return user._id;
            } else if(tab==='communityList'){
                return user._id;
            }
        }
    }
});

Template.profile.events({
    'click .navbar-nav li': function(event, template){
        var currentTab = $(event.target).closest("li");
        template.currentTab.set(currentTab.data( "template" ));
    },
    'click #sendMessage': function (event, template) {
        event.preventDefault();
        var userId = template.data.user._id;

        //Meteor.call
    }
});