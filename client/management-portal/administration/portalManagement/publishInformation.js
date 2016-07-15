Template.publishInformation.onRendered(function(){
    $('#publicationForm').validate({
        rules:{
            inputTitle: {
                required: true
            },
            inputBody: {
                required: true
            },
            inputType: {
                required: true
            }
        },
        messages: {
            inputTitle: {
                required: TAPi18n.__('title_required')
            },
            inputBody: {
                required: TAPi18n.__('body_required')
            },
            inputType:{
                required: TAPi18n.__('type_required')
            }
        },
        submitHandler: function() {
            var files = $('#informationFileInput').prop("files");
            var publication = {
                title: $('#inputTitle').val(),
                body: $('#inputBody').val(),
                type: $('#inputType').val()
            };

            if(files.length>0){
                var path = Session.get('path');
                for (var i = 0, ln = files.length; i < ln; i++) {
                    FileStorage.insert(files[i], function (error, fileObj) {
                        if(error){
                            Bert.alert(TAPi18n.__('insert_failure') +': '+ error.message);
                        }else{
                            publication.file = {
                                name: fileObj.name(),
                                fileId: fileObj._id
                            };
                            Meteor.call('newPublication', publication, function(error){
                                if(error){
                                    Bert.alert(TAPi18n.__('publish_information_failure'), 'danger');
                                }else{
                                    Bert.alert(TAPi18n.__('publish_information_success'), 'success');
                                }
                            });
                        }
                    });
                }
            }else{
                Meteor.call('newPublication', publication, function(error){
                    if(error){
                        Bert.alert(TAPi18n.__('publish_information_failure'), 'danger');
                    }else{
                        Bert.alert(TAPi18n.__('publish_information_success'), 'success');
                    }
                });
            }
        }
    })
});