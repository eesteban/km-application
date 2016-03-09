Accounts.onEnrollmentLink(function(token, done){
    console.log('onENrollment');
    Router.go('/enrollment/:' + token);
});