var emailList = new ReactiveArray();
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
                required: "Please specify an Email",
                email: "Introduce a valid email address please (email@example.com)"
            }
        },
        submitHandler: function() {
            var email = $('#inputEmail').val();
            if(emailList.indexOf(email)<0){
                emailList.push(email);
            }else{
                Bert.alert('That email is already in the list', 'danger')
            }
        },
        errorLabelContainer: '#errorMessage'
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
        Meteor.call('inviteUsers', emailList.array(), function(error){
            if(error){
                Bert.alert(TAPi18n.__('user_not_invited'), 'danger');
            }else{
                Bert.alert(TAPi18n.__('user_invited'), 'success');
            }
        });
    }
});

Template.inviteUsers.helpers({
    emailList: function (){
        return emailList.list();
    }
});
