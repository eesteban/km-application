Meteor.methods({
    inviteUsers: function (emailList){
        for(var i=0; i<emailList.length; i++){
            var user = {
                email: emailList[i],
                profile: {
                    type: 'staff'
                }
            };
            console.log(JSON.stringify(user));
            var userId = Accounts.createUser(user);
            Accounts.sendEnrollmentEmail(userId);
        }
    }
});

Accounts.emailTemplates.siteName = 'KM_edu';
Accounts.emailTemplates.siteName = 'KM_edu Administrator <accounts@km-application.com>';
Accounts.emailTemplates.enrollAccount = {
    subject: function () {
        return 'Enrollment email for KM Edu';
    },
    text: function (user, url) {
        return 'To register in the application visit the following link:\n\n '+
                url + '\n\n' +
                'If you feel something is wrong, please contact with the management of your school';
    }
};