Template.studentLink.onCreated(function () {
    Meteor.subscribe('studentProfile', this.data.id);
});

Template.studentLink.helpers({
    student: function(){
        return Students.findOne(Template.instance().data.id);
    }
});