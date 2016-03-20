Template.createCommunity.onRendered(function(){
    Meteor.subscribe("otherUsersBasic");
    Meteor.subscribe("communitiesBasic");
    $('#createCommunity').validate({
        rules:{
            inputCommunityName: {
                required: true
            }
        },
        messages: {
            inputCommunityName: {
                required: TAPi18n.__('required_community_name')
            }
        },
        submitHandler: function() {
            var userArray = [];
            Meteor.users.find({status:'invited'}).forEach(function(user){
                userArray.push(user._id);
            });
            var community = {
                name: $('#inputCommunityName').val(),
                type: $('#inputCommunityType').val(),
                users: userArray
            };

            Meteor.call('createCommunity', community, function(error){
                if(error){
                    Bert.alert(error.reason, 'danger');
                }else{
                    Bert.alert(TAPi18n.__('community_success'), 'success');
                }
            });
        }
    })
});

Template.createCommunity.helpers({
    availableUsers: function(){
        return Meteor.users.find(
            {_id: { $ne: Meteor.userId()}, status : { $exists : false }}
        );
    },
    invitedUsers: function(){
        if(Meteor.users.find({status:'invited'}).count()<1){
            return false
        }else{
            return Meteor.users.find({status:'invited'});
        }
    }
});

Template.createCommunity.events({
    'change #inputAvailableUsers': function(event){
        event.preventDefault();
        var userIdArray = $('#inputAvailableUsers').val();
        userIdArray.every(function(userId){
            Meteor.users._collection.update({_id: userId}, {$set:{ status:'invited'}});
        });
    },
    'click .delete-user': function (event) {
        event.preventDefault();
        var userId = $(event.target).attr('id');
        console.log(userId);
        Meteor.users._collection.update({_id: userId}, {$unset:{status:'invited'}});
    },
    'submit #createCommunity': function(event){
        event.preventDefault();
    }
});