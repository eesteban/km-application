Template.registerHelper("isEmpty", function (object) {
    return jQuery.isEmpty(object);
});

Template.registerHelper('equals', function (a, b) {
    return a === b;
});

Template.registerHelper('translate', function (text) {
    return TAPi18n.__(text);
});

Template.registerHelper('formatDate', function(time){
    var date = new Date(time);
    return date.getDate() + "/"
       + (date.getMonth()+1)  + "/"
       + date.getFullYear() + " - "
       + date.getHours() + ":"
       + (date.getMinutes()<10?'0':'') + date.getMinutes()
});

Template.registerHelper('isAdmin', function(){
    return Meteor.users.findOne({_id: Meteor.userId(), type: 'admin'});
});

Template.registerHelper('count', function (array){
    return array.length;
});