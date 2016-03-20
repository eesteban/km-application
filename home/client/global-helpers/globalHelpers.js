Template.registerHelper("isEmpty", function (object) {
    return jQuery.isEmpty(object);
});

Template.registerHelper('equals', function (a, b) {
    return a === b;
});