Template.newPost.onRendered(function(){
    $('#newPostForm').validate({
        rules:{
            inputPost: {
                required: true
            }
        },
        messages: {
            inputPost: {
                required: TAPi18n.__('body_required')
            }
        },
        submitHandler: function() {
            var post = $('#inputPost').val();
            var communityId = Session.get('currentCommunity');
            var topicIndex = Session.get('selectedTopicIndex');

            Meteor.call('newPost', communityId, topicIndex, post, function(error){
                if(error){
                    Bert.alert(TAPi18n.__('new_post_failure'), 'danger');
                }else{
                    Bert.alert(TAPi18n.__('new_post_success'), 'success');
                    $('#newPost').modal('toggle');
                }
            });
        }
    })
});

Template.newTopic.events({
    'submit #newPostForm': function(event){
        event.preventDefault();
    }
});