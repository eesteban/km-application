Template.addStudent.onRendered(function(){
    Meteor.subscribe("students");

    $('#addStudentForm').validate({
        rules:{
            inputName: {
                required: true
            },
            inputSurname: {
                required: true
            }
        },
        messages: {
            inputName: {
                required: TAPi18n.__('name_required')
            },
            inputSurname: {
                required: TAPi18n.__('email_required')
            }
        },
        submitHandler: function() {
            var student = {
                profile: {
                    name:  $('#inputName').val(),
                    surname: $('#inputSurname').val()
                }
            };

            Meteor.call('insertStudent', student, function(error){
                if(error){
                    Bert.alert(TAPi18n.__('student_insert_error'), 'danger')
                }else{
                    Bert.alert(TAPi18n.__('student_insert_sucess'), 'success')
                }
            });
        }
    })
});

Template.addStudent.events({
    'submit addStudentForm': function(){
        event.preventDefault();
    }
});