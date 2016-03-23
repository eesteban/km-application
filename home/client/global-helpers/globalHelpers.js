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
       + date.getMinutes()
});

Template.registerHelper('count', function (array){
    return array.length;
});