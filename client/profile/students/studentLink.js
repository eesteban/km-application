Template.studentLink.onCreated(function () {
    var studentId = this.data.id;
    if(studentId){
        Meteor.subscribe('studentProfile', studentId);
    }
});

Template.studentLink.helpers({
    student: function(){
        var student = Template.instance().data.student;
        if(student){
            return student
        }else{
            return Students.findOne(Template.instance().data.id);
        }
    }
});

Template.studentLink.events({
    'click .studentLink': function(){
        var studentId = Template.instance().data.id;
        if(!studentId){
            studentId = Template.instance().data.student._id;
        }
        Session.set('selectedStudent', studentId);
    }
});