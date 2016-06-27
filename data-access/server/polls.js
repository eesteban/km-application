Meteor.methods({
    addPoll: function(question, options, multipleChoice){
        check(question, String);
        check(options, [String]);
        check(multipleChoice, Boolean);

        var userId = Meteor.userId();
        var userType = Meteor.user().type;
        if(userId && userType==='admin'){
            var poll = {
                question: question,
                createdBy: userId,
                users: [],
                options: [],
                multipleChoice: multipleChoice
            };

            for(var i=0, k=options.length; i<k; i++){
                poll.options.push({
                    value: options[i],
                    votes: 0
                });
            }

            Polls.insert(poll);
        }else{
            throw new Meteor.Error('logged-out', TAPi18n.__("poll_not_created"));
        }
    },
    replyPoll: function(pollId, reply){
        check(pollId, String);
        check(reply, [String]);

        var userId = Meteor.userId();
        if(userId){
            var poll = Polls.findOne({_id: pollId, users: {$nin: [userId]}});
            var replyLength = reply.length;

            if(poll && replyLength>0){
                poll.users.push(userId);
                for(var i=0, k= replyLength; i<k; i++){
                    var index = reply[i];
                    poll.options[index]['votes'] = poll.options[index]['votes']+1;
                }

                Polls.update(pollId, poll);

            }else{
                throw new Meteor.Error('non_valid_poll', TAPi18n.__("not_replied"));
            }
        }else{
            throw new Meteor.Error('logged-out', TAPi18n.__("not_replied"));
        }
    }
});

Meteor.publish('polls', function() {
    return Polls.find({finished:{$ne: true}});
});