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
                required: TAPi18next.t('required_username')
            },
            inputSurname: {
                required: TAPi18next.t('required_email')
            }
        },
        submitHandler: function() {
            var name =  $('#inputName').val();
            var surname = $('#inputSurname').val();

            Meteor.call('insertStudent', name, surname, function(error){
                if(error){
                    Bert.alert(TAPi18next.t('student_insert_error'), 'danger')
                }else{
                    Bert.alert(TAPi18next.t('student_insert_sucess'), 'success')
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