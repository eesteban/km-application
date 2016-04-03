Accounts.emailTemplates.siteName = 'KM_edu';
Accounts.emailTemplates.siteName = 'KM_edu Administrator <accounts@km-application.com>';
Accounts.emailTemplates.enrollAccount = {
    subject: function () {
        return 'Enrollment email for KM Edu';
    },
    text: function (user, url) {
        return 'To register in the application visit the following link:\n\n'+
                url + '\n\n' +
                'If you feel something is wrong, please contact with the management of your school';
    }
};

