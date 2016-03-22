Meteor.publish('studentsComplete', function(){
    if(Meteor.user().type==="admin"){
        var students =  Students.find(
            {},
            {fields: {
                'name': 1,
                'surname': 1,
                'groups': 1
            }}
        );

        if(students){
            return students;
        }
    }else{
        return this.ready();
    }
});

Students.allow({
    insert: function () {
        return Meteor.user().type==="admin";
    },
    update: function (userId, student) {
        if(Meteor.user().type==="admin"){
            return true;
        }else{
            return $.inArray(userId, student.users)>=0;
        }
    },
    remove:function(){
        return Meteor.user().type==="admin";
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