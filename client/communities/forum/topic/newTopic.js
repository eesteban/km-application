Template.newTopic.onRendered(function(){
    $('#newTopicForm').validate({
        rules:{
            inputTopic: {
                required: true
            },
            inputDescription: {
                required: true
            },
            inputPost: {
                required: true
            }
        },
        messages: {
            inputTopic: {
                required: TAPi18n.__('topic_required')
            },
            inputDescription: {
                required: TAPi18n.__('description_required')
            },
            inputPost: {
                required: TAPi18n.__('body_required')
            }
        },
        submitHandler: function() {
            var topic =  $('#inputTopic').val();
            var description = $('#inputDescription').val();
            var post = $('#inputPost').val();
            var communityId = Session.get('currentCommunity');

            Meteor.call('newTopic', communityId, topic, description, post, function(error){
                if(error){
                    Bert.alert(TAPi18n.__('new_topic_failure'), 'danger');
                }else{
                    Bert.alert(TAPi18n.__('new_topic_success'), 'success');
                    $('#newTopic').modal('toggle');
                }
            });
        }
    })
});

Template.newTopic.events({
    'submit #newTopicForm': function(event){
        event.preventDefault();
    }
});