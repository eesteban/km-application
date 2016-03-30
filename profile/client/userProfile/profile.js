Template.profile.onCreated(function(){
    this.currentTab = new ReactiveVar('aboutUser');
});

Template.profile.events({
    'click .nav-tabs li': function(event, template){
        var currentTab = $(event.target).closest("li");

        currentTab.addClass( "active" );
        $(".nav-tabs li").not( currentTab ).removeClass( "active" );

        template.currentTab.set(currentTab.data( "template" ));
    }

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
                return user.blog;
            } else if(tab==='communityList'){
                return user._id;
            }
        }
    }
});