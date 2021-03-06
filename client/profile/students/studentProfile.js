Template.studentProfile.helpers({
    accessToStudent : function () {
        var student = Template.instance().data;
        if(student){
            var studentId = student._id;
            if(studentId){
                if(Meteor.user().type==='admin'){
                    return true;
                }else{
                    return !!Communities.findOne({
                        type: 'student_group',
                        users: Meteor.userId(),
                        'information.students': studentId
                    });
                }
            }else {
                return false
            }
        }else{
            return false;
        }
    }
});