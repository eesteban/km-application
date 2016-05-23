Template.newConversation.onRendered(function(){
    var toId = this.data;
    $('#newConversationForm').validate({
        rules:{
            inputMessage: {
                required: true
            }
        },
        messages: {
            inputMessage: {
                required: TAPi18n.__('required_message')
            }
        },
        submitHandler: function() {
            var users = [];
            if(toId){
                users.push(toId);
            }else{
                Meteor.users.find({selected:true}, {_id: 1}).forEach(
                    function(user){
                        users.push(user._id);
                    }
                );
            }

            var message =  $('#inputMessage').val();
            Meteor.call('newConversation', users, message, function(error){
                if(error){
                    Bert.alert(TAPi18n.__('new_conversation_failure'), 'danger');
                }else{
                    Bert.alert(TAPi18n.__('new_conversation_success'), 'success');
                    $('#newConversation').modal('toggle');
                }
            });
        }
    })
});

Template.newConversation.events({
    'submit #newConversationForm': function(event){
        event.preventDefault();
    },
    'click #createConversation': function (event) {
        event.preventDefault();
        $('#newConversationForm').submit();
    }
});

Template.newConversation.helpers({
    toId: function () {
        return Template.instance().data;
    }
});