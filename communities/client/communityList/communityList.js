Template.communityList.onCreated(function(){
   if(this.data){
       Meteor.subscribe('communitiesUser', this.data);
   }else{
       Meteor.subscribe('communitiesAll')
   }
});

Template.communityList.helpers({
    communityList: function(){
        if(Template.instance().data){
            return Communities.find({users: Template.instance().data});
        }else{
            return Communities.find();
        }
    }
});