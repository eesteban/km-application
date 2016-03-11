Meteor.methods({
    inviteUsers: function (emailList){
        for(var i=0; i<emailList.length; i++){
            var user = {
                email: emailList[i],
                type: 'staff'
            };
            console.log(JSON.stringify(user));
            var userId = Accounts.createUser(user);
            Accounts.sendEnrollmentEmail(userId);
        }
    },
    /*updateUsername: function (username){
        var userId = Meteor.userId();
        if(userId){
            Meteor.users.update(userId, {$set: {username: username}});
        }else{
            throw new Meteor.Error('Not user Loged In');
        }
    },*/
    updateUser: function (profile, username){
        var userID = Meteor.userId();
        if(userID){
            console.log('Update user (' + userID + ')');
            console.log('Update user (' + userID + ') - Profile:' + JSON.stringify(profile));
            console.log('Update user (' + userID + ') - Username:' + username);
            if(profile && username){
                Meteor.users.update(userID, {$set: {username: username, profile: profile, updated: true}});
            }else if(profile){
                Meteor.users.update(userID, {$set: {profile: profile, updated: true}});
            }else if(username) {
                Meteor.users.update(userID, {$set: {username: username, updated: true}});
            }else{
                throw new Meteor.Error('Incorrect user update');
            }
        }else{
            throw new Meteor.Error('Not user Loged In');
        }
    }
});

Accounts.onCreateUser(function(options, user){
    console.log('onCreateUser');
    user.type = options.type;
    user.createdAt = new Date();
    user.updated = false;
    return user;
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

