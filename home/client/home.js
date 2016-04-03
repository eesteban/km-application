Template.home.helpers({
    enrollmentToken: function(){
        return Session.get('enrollmentToken');
    }
});