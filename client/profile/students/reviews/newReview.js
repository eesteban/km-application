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
                required: TAPi18n.__('title_required')
            },
            inputBody: {
                required: TAPi18n.__('body_required')
            }
        },
        submitHandler: function() {
            var studentId = Session.get('selectedStudent');
            console.log(studentId);
            if(studentId){
                var review = {
                    title: $('#inputTitle').val(),
                    body: $('#inputBody').val()
                };

                var files = $('#reviewFileInput').prop("files");
                if(files.length>0){
                    var path = Session.get('path');
                    for (var i = 0, ln = files.length; i < ln; i++) {
                        FileStorage.insert(files[i], function (error, fileObj) {
                            if(error){
                                Bert.alert(TAPi18n.__('insert-failure') +': '+ error.message);
                            }else{
                                review.file = {
                                    name: fileObj.name(),
                                    fileId: fileObj._id
                                };
                                Meteor.call('newStudentReview', studentId, review, function(error){
                                    if(error){
                                        Bert.alert(TAPi18n.__('new_review_failure'), 'danger');
                                    }else{
                                        $('#newReview').modal('toggle');
                                    }
                                });
                            }
                        });
                    }
                }else{
                    console.log('studReview_noFile');
                    Meteor.call('newStudentReview', studentId, review, function(error){
                        if(error){
                            Bert.alert(TAPi18n.__('new_review_failure'), 'danger');
                        }else{
                            $('#newReview').modal('toggle');
                        }
                    });
                }
            }
        }
    })
});

Template.newReview.events({
    'submit #newReviewForm': function(event){
        event.preventDefault();
    }
});