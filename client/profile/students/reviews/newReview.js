Template.newReview.onRendered(function(){
    $('#newReviewForm').validate({
        rules:{
            inputTitle: {
                required: true
            },
            inputBody: {
                required: true
            }
        },
        messages: {
            inputTitle: {
                required: TAPi18n.__('required_title')
            },
            inputBody: {
                required: TAPi18n.__('required_body')
            }
        },
        submitHandler: function() {
            var title =  $('#inputTitle').val();
            var body = $('#inputBody').val();
            var studentId = Session.get('selectedStudent');
            
            Meteor.call('newStudentReview', studentId, title, body, function(error){
                if(error){
                    Bert.alert(TAPi18n.__('new_student_review_failure'), 'danger');
                }else{
                    $('#newReview').modal('toggle');
                }
            });
        }
    })
});