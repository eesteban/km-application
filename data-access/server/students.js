Meteor.publish('studentsComplete', function(){
    var userId = this.userId;
    if(userId){
        var userType = Meteor.users.findOne(userId, {type:1}).type;
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
        }
    }
    return this.ready();

});

Meteor.publish('studentProfile', function(studentId){
    check(studentId, String);
    var userId = this.userId;
    if(userId){
        var userType = Meteor.users.findOne(userId, {type:1}).type;
        if(userType==="admin" || Communities.find({type:'student_group', users:userId, students: studentId})){
            var student =  Students.find(
                studentId,
                {fields: {
                    'profile': 1
                }}
            );

            if(student){
                return student;
            }
        }
    }

    return this.ready();
});

Meteor.publish('studentComplete', function(studentId){
    check(studentId, String);
    var userId = this.userId;
    if(userId) {
        var isAdmin = Meteor.users.findOne(userId, {type: 1}).type === "admin";
        var isAssigned = Communities.find({
            type: 'student_group',
            users: userId,
            'information.students': studentId
        }).count()>0;

        if (isAdmin || isAssigned) {
            var student = Students.find(
                studentId,
                {
                    fields: {
                        'profile': 1,
                        'groups': 1
                    }
                }
            );

            if (student) {
                return student;
            }
        }
    }

    return this.ready();
});

Meteor.methods({
    insertStudent: function(name, surname){
        check(name, String);
        check(surname, String);

        var userId = Meteor.userId();
        if(userId){
            var student ={
                profile: {
                    name: name,
                    surname: surname
                },
                users:  [userId],
                createdAt: Date.now(),
                createdBy:  userId,
                groups :[]
            };

            var studentId = Students.insert(student);
            if (!studentId) throw new Meteor.Error('insert-student', TAPi18n.__('student_not_created'));

            return studentId;
        }else{
            throw new Meteor.Error('logged-out', TAPi18n.__('logged-out'));
        }
    },
    addGroupToStudent: function(studentId, groupId){
        //Students.update({_id:studentId}, )
    }
});