Template.communityLink.helpers({
    community: function(){
        return Communities.findOne(Template.instance().data.id, {name:1});
    }
});