Template.createCommunity.onCreated(function(){
    this.currentCommunityType = new ReactiveVar('createProfessionalGroup');
    Meteor.subscribe("userPrivate");
    Meteor.subscribe("otherUsersBasic");
    Meteor.subscribe("communitiesBasic");
});

Template.createCommunity.onRendered(function(){
    var instance = this;
    $('#createCommunity').validate({
        rules:{
            inputCommunityName: {
                required: true
            }
        },
        messages: {
            inputCommunityName: {
                required: TAPi18n.__('name_required')
            }
        },
        submitHandler: function() {
            var community = {
                name: String,
                users: [],
                type: String
            };
            community.name =  $('#inputCommunityName').val();
            Meteor.users.find({selected:true}, {_id: 1}).forEach(
                function(user){
                    community.users.push(user._id);
                }
            );

            var currentCommunityType = instance.currentCommunityType.get();

            var information = {};

            if(currentCommunityType==='createProfessionalGroup'){
                community.type = 'professional_group';
                information.topics = Session.get('topics');
            }else if(currentCommunityType==='createActivityGroup'){
                community.type = 'activity_group';
                information.activityType = $('#inputActivityType').val();
                information.budget = {
                    type: $('#inputBudgetType').val(),
                    amount: $('#inputBudget').val()
                };
                information.location =  $('#inputLocation').val();
                information.studentGroups = [ ];
                Communities.find({type: 'student', selected: true}, {_id: 1}).forEach(
                    function(studentGroup){
                        information.studentGroups.push(studentGroup._id);
                    }
                );
            }else if(currentCommunityType==='createStudentGroup'){
                community.type = 'student_group';
                information.students = [];
                Students.find({selected: true}, {_id: 1}).forEach(
                    function(student){
                        information.students.push(student._id);
                    }
                );
            }
            community.information = information;

            console.log(community);

            Meteor.call('insertCommunity', community, function(error){
                if(error){
                    Bert.alert(TAPi18n.__('insert_community_failure'), 'danger');
                }else{
                    Bert.alert(TAPi18n.__('insert_community_success'), 'success');
                }
            });
        }
    })
});

Template.createCommunity.helpers({
    communityType: function() {
        return Template.instance().currentCommunityType.get();
    },
    availableUsers: function(){
        return Meteor.users.find(
            {_id: { $ne: Meteor.userId()}, invited : { $not : true }}
        );
    },
    invitedUsers: function(){
        return Meteor.users.find({invited: true});
    }
});

Template.createCommunity.events({
    'change #inputCommunityType' : function(event, template){
        template.currentCommunityType.set($(event.target).val());
    },
    'select #inputAvailableUsers': function(event){
        event.preventDefault();
        var userIdArray = $('#inputAvailableUsers').val();
        userIdArray.every(function(userId){
            Meteor.users._collection.update({_id: userId}, {$set:{ invited: true}});
        });
    },
    'click .delete-user': function (event) {
        event.preventDefault();
        var userId = $(event.target).attr('id');
        console.log(userId);
        Meteor.users._collection.update({_id: userId}, {$unset:{invited: true}});
    },
    'submit #createCommunity': function(event){
        event.preventDefault();
    }
});