Template.registerHelper("isEmpty", function (object) {
    return jQuery.isEmpty(object);
});

Meteor.subscribe("userData");

Template.registerHelper("userData", function(){
    return Meteor.users.findOne(Meteor.userId());
});