Template.studentLink.onCreated(function () {
    Meteor.subscribe('studentProfile', this.data.id);
});

Template.studentLink.helpers({
    student: function(){
        return Students.findOne(Template.instance().data.id);
    }
});

Template.studentLink.events({
    'click .studentLink': function(){
        var studentId = Template.instance().data.id;
        Session.set('selectedStudent', studentId);
    }
});