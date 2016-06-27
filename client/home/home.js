Template.home.helpers({
    enrollmentToken: function(){
        return Session.get('enrollmentToken');
    },
    resetPasswordToken: function(){
        return Session.get('resetPasswordToken');
    }
});