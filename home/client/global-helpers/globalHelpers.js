Template.registerHelper("isEmpty", function (object) {
    return jQuery.isEmpty(object);
});

Template.registerHelper('equals', function (a, b) {
    return a === b;
});

Template.registerHelper('translate', function (text) {
    return TAPi18n.__(text);
});