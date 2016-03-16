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
            console.log(aboutMe);
            Meteor.users.update(Meteor.userId(), {$set: {aboutMe: aboutMe}}, function(error){
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
                required: "Please specify a new interest"
            }
        },
        submitHandler: function() {
            var interest = $('#interest').val();
            if(Meteor.user().interests){
                if(Meteor.user().interests.indexOf(interest)<0){
                    Meteor.users.update(Meteor.userId(), {$push: {interests: interest}})
                }else{
                    Bert.alert('That interest is already in the list', 'danger')
                }
            }else{
                Meteor.users.update(Meteor.userId(), {$set: {interests: [interest]}})
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
                required: "Please specify a new skill"
            }
        },
        submitHandler: function() {
            var skill = $('#skill').val();
            if(Meteor.user().skills){
                if(Meteor.user().skills.indexOf(skill)<0){
                    Meteor.users.update(Meteor.userId(), {$push: {skills: skill}})
                }else{
                    Bert.alert('That skill is already in the list', 'danger')
                }
            }else{
                Meteor.users.update(Meteor.userId(), {$set: {skills: [skill]}})
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
        Meteor.users.update(Meteor.userId(), {$pull: {interests: this.toString()}});
    },
    'submit #newSkill': function (event) {
        event.preventDefault();
    },
    'click .removeSkill': function (event){
        event.preventDefault();
        Meteor.users.update(Meteor.userId(), {$pull: {skills: this.toString()}});
    }
});