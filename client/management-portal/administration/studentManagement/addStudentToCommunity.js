Template.addStudentToCommunity.onCreated(function(){
    this.subscribe('userStudents');
    this.subscribe('studentGroups');
});

Template.addStudentToCommunity.events({
    'click #addStudentToCommunity': function () {
        var students = [];
        Students.find({selected: true}, {_id: 1}).forEach(
            function(student){
                students.push(student._id);
            }
        );

        var communities = [];
        Communities.find({selected: true}, {_id: 1}).forEach(
            function(community){
                communities.push(community._id);
            }
        );

        if (students.length > 0) {
            if (communities.length > 0) {
                Meteor.call('addStudentsToCommunity', communities, students, function (error) {
                    if (error) {
                        Bert.alert(TAPi18n.__("add_student_community_failure"), 'warning')
                    } else {
                        Bert.alert(TAPi18n.__("add_student_community_success"), 'success')
                    }
                })
            } else {
                console.log('not_communities');
                Bert.alert(TAPi18n.__("add_student_community_failure"), 'warning')
            }
        } else {
            console.log('not_students');
            Bert.alert(TAPi18n.__("add_student_community_failure"), 'warning')
        }
    }
});
