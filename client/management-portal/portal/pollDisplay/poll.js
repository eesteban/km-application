Template.poll.events({
    'submit #pollReplyForm': function(event, template){
        event.preventDefault();
        var multipleChoice = template.data.multipleChoice;
        
        var reply=[];
        if(multipleChoice){
            reply=$('input[name=reply]:checked', '#pollReplyForm').map(function() {
                return $(this).val();
            }).get();
        }else{
            reply.push($('input[name=reply]:checked', '#pollReplyForm').val());
        }
        console.log(reply);
        
        if(reply.length>0){
            var pollId = template.data._id;
            Meteor.call('replyPoll', pollId, reply);
        }else{
            Bert.alert(TAPi18n.__('not_reply'), 'warning');
        }
    }
});

Template.poll.helpers({
    multipleChoice: function(){
        return Template.instance().data.multipleChoice;
    }
});