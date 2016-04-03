var emailList = new ReactiveArray();
Template.inviteUsers.onCreated(function(){
    Meteor.subscribe("otherUsersEmails");
});

Template.inviteUsers.onRendered(function(){
    $("#inviteUserForm").validate({
        rules:{
            inputEmail: {
                required: true,
                email:true
            }
        },
        messages: {
            inputEmail: {
                required: TAPi18n.__("email_required"),
                email: TAPi18n.__("email_invalid")
            }
        },
        submitHandler: function() {
            var email = $('#inputEmail').val();
            if(emailList.indexOf(email)<0){
                if(Meteor.users.find({'emails.address': email}).count()>0){
                    Bert.alert(TAPi18n.__('email_exist'), 'danger');
                }else{
                    emailList.push(email);
                }
            }else{
                Bert.alert(TAPi18n.__("email_in_list"), 'danger')
            }
        },
        errorLabelContainer: "#error"
    })

});

Template.inviteUsers.events({
    'submit form': function (event) {
        event.preventDefault();
    },
    'click .delete-user': function (event) {
        event.preventDefault();
        return emailList.remove(this.toString());
    },
    'click #inviteUsers': function () {
        var emails = emailList.array();
        Meteor.call('inviteUsers', emails, function(error){
            if(error){
                Bert.alert(TAPi18n.__('user_not_invited'), 'danger');
            }else{
                Bert.alert(TAPi18n.__('user_invited'), 'success');
            }
        });
        emailList.clear();
    }
});

Template.inviteUsers.helpers({
    emailList: function (){
        return emailList.list();
    }
});
