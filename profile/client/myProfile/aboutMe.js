Template.aboutMe.onRendered(function () {
    $('#aboutMeForm').validate({
        rules:{
            aboutMe: {
                required: true
            }
        },
        messages: {
            aboutMe: {
                required:'Please specify some information about you'
            }
        },
        submitHandler: function(){
            var aboutMe = $('#aboutMeInput').val();
            Meteor.users.update(Meteor.userId(), {$set: {'profile.aboutMe': aboutMe}}, function(error){
                if(error){
                    Bert.alert('Error updating the personal information', 'danger');
                }else{
                    Bert.alert('Personal information correctly updated', 'success');
                }
            });
        },
        errorLabelContainer: "#errorMessageAboutMe"
    });
    $("#newInterest").validate({
        rules:{
            interest: {
                required: true
            }
        },
        messages: {
            interest: {
                required: TAPi18n.__('interest_required')
            }
        },
        submitHandler: function() {
            var interest = $('#interest').val();
            if(Meteor.user().profile.interests.indexOf(interest)<0) {
                Meteor.call('addInterest', interest, function (error) {
                    if (error) {
                        Bert.alert(TAPi18n.__('interest_failure'), 'danger')
                    }
                });
            }else{
                Bert.alert(TAPi18n.__('interest_in_list'), 'warning')
            }
        },
        errorLabelContainer: '#errorMessageInterest'
    });
    $("#newSkill").validate({
        rules:{
            skill: {
                required: true
            }
        },
        messages: {
            skill: {
                required: TAPi18n.__('skill_required')
            }
        },
        submitHandler: function() {
            var skill = $('#skill').val();
            if(Meteor.user().profile.skills.indexOf(skill)<0){
                Meteor.call('addSkill', skill, function(error){
                    if(error){
                        Bert.alert(TAPi18n.__('skill_failure'), 'danger')
                    }
                });
            }else{
                Bert.alert(TAPi18n.__('skill_in_list'), 'warning')
            }

        },
        errorLabelContainer: '#errorMessageSkill'
    });
});
Template.aboutMe.events({
    'submit #aboutMeForm': function (event) {
        event.preventDefault();
    },
    'submit #newInterest': function (event) {
        event.preventDefault();
    },
    'click .removeInterest': function (event){
        event.preventDefault();
        Meteor.users.update(Meteor.userId(), {$pull: {'profile.interests': this.toString()}});
    },
    'submit #newSkill': function (event) {
        event.preventDefault();
    },
    'click .removeSkill': function (event){
        event.preventDefault();
        Meteor.users.update(Meteor.userId(), {$pull: {'profile.skills': this.toString()}});
    }
});