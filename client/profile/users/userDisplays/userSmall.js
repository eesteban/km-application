Template.userSmall.onCreated(function () {
    var templateInfo = this.data;
    
    Meteor.subscribe()

    if(typeof templateInfo == 'string'){
        Meteor.subscribe("profilePictureInformation", templateInfo);
    }else{        
        Meteor.subscribe("profilePictureInformation", templateInfo._id);
    }
});
Template.userSmall.helpers({
    user: function(){
        var templateInfo = Template.instance().data;
        if(typeof templateInfo == 'string'){
            return Meteor.users.findOne(templateInfo);
        }else{
            return templateInfo;
        }
    }
});