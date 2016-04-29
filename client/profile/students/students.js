Template.students.helpers({
    students : function() {
        return Students.find({}, {profile: 1});
    }
});