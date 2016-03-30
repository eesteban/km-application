Meteor.publish('studentsComplete', function(){
    var userType = Meteor.users.findOne(this.userId, {type:1}).type;
    if(userType==="admin"){
        var students =  Students.find(
            {},
            {fields: {
                'profile': 1,
                'groups': 1
            }}
        );

        if(students){
            return students;
        }
        return this.ready();
    }else{
        return this.ready();
    }
});

Meteor.methods({
    insertStudent: function(student){
        var userId = Meteor.userId();
        if(userId){
            student.users = [userId];
            student.createdAt = Date.now();
            student.createdBy = userId;
            var studentId = Students.insert(student);
            if (!studentId) throw new Meteor.Error('insert-student', TAPi18n.__('student_not_created'));
        }else{
            throw new Meteor.Error('logged-out', TAPi18n.__('logged-out'));
        }
    },
    addGroupToStudent: function(studentId, groupId){
        //Students.update({_id:studentId}, )
    }
});