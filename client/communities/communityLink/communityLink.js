Template.communityLink.helpers({
    community: function(){
        var community = Template.instance().data.community;
        if(community){
            return community
        }else{
            return Communities.findOne(Template.instance().data.id, {name:1});
        }
    }
});