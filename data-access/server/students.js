var reviewPattern = {
    title: String,
    body: String,
    file: Match.Optional({
        name: String,
        fileId: String
    })
};

Meteor.publish('userStudents', function(){
    var userId = this.userId;
    if(userId){
        var userType = Meteor.users.findOne(userId, {type:1}).type;
        var projection = {
            fields: {
                profile: 1
            }
        };
        var students;

        if(userType==='admin'){
            students = Students.find({}, projection);
        } else {
            var userStudentGroups = Communities.find({type: 'student_group', users: userId},  {'information.students': 1});
            if(userStudentGroups){
                var userStudents = [];
                userStudentGroups.forEach(function (studentGroup) {
                    var candidateStudents = studentGroup.information.students;
                    for(var i=0, k=candidateStudents.length; i<k; i++){
                        userStudents.push(candidateStudents[i]);
                    }
                });
                if(userStudents){
                    console.log('All the users students');
                    console.log(userStudents);

                    students = Students.find({_id: {$in: userStudents}}, projection);
                }
            }
        }
        if(students){
            return students;
        }
    }

    return this.ready();
});

Meteor.publish('studentProfile', function(studentId){
    check(studentId, String);
    var userId = this.userId;
    if(userId){
        if(hasAccess(userId, studentId)){
            var student = Students.find(
                studentId,
                {fields: {
                    profile: 1
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
        if(hasAccess(userId, studentId)){
            var student = Students.find(
                studentId,
                {
                    fields: {
                        profile: 1,
                        groups: 1,
                        reviews: 1
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
                    surname: surname,
                    completeName: name + ' ' + surname
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
    newStudentReview: function (studentId, review) {
        check(studentId, String);
        check(review, reviewPattern);

        var userId = Meteor.userId();
        if(userId){
            Students.update(studentId, {$addToSet: {reviews: review}});
        }else{
            throw new Meteor.Error('logged-out', TAPi18n.__('logged-out'));
        }
    }
    // addGroupToStudent: function(studentId, groupId){
    //     Students.update({_id:studentId}, )
    // }
});

function hasAccess(userId, studentId){
    var user = Meteor.users.findOne(userId, {type: 1});
    if(user){
        return user.type==="admin" || Communities.find({type:'student_group', users: userId, 'information.students': studentId}).count()>0;
    }
}