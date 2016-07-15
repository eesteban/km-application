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
                required: TAPi18next.t('username_required')
            },
            inputSurname: {
                required: TAPi18next.t('email_required')
            }
        },
        submitHandler: function() {
            var name =  $('#inputName').val();
            var surname = $('#inputSurname').val();

            Meteor.call('insertStudent', name, surname, function(error){
                if(error){
                    Bert.alert(TAPi18next.t('insert_student_failure'), 'danger')
                }else{
                    Bert.alert(TAPi18next.t('insert_student_success'), 'success')
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