Template.registerHelper("isEmpty", function (object) {
    return jQuery.isEmpty(object);
});

Template.registerHelper('equals', function (a, b) {
    return a === b;
});

Template.registerHelper('translate', function (text) {
    return TAPi18n.__(text);
});

Template.registerHelper('isAdmin', function(){
    return Meteor.user().type = 'admin';
});

Template.registerHelper('count', function (array){
    return array.length;
});

Template.registerHelper('accessToCommunity', function(communityId){
    var community = Communities.findOne(communityId, {type:1, users:1});
    if(community.type==='student_group'){
        return !!Communities.findOne({_id: community._id, users:Meteor.userId()});
    }else {
        return true;
    }
});

Template.registerHelper('accessToStudent', function(communityId){
    var community = Communities.findOne(communityId, {type:1, users:1});
    if(community.type==='student_group'){
        return !!Communities.findOne({_id: community._id, users:Meteor.userId()});
    }else {
        return true;
    }
});

Template.registerHelper('getUserCompleteName', function(userId){
    return Meteor.users.findOne(userId, {'profile.completeName':1}).profile.completeName;
});