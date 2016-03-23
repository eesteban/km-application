Template.community.onCreated(function(){
    this.currentTab = new ReactiveVar('forum');
});

Template.community.events({
    'click .nav-tabs li': function(event, template){
        var currentTab = $(event.target).closest("li");

        currentTab.addClass( "active" );
        $(".nav-tabs li").not( currentTab ).removeClass( "active" );

        template.currentTab.set(currentTab.data( "template" ));
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
                return community.forum;
            }else if(tab==='members'){
                return community.users;
            }
        }
    }
});