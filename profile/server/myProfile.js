Meteor.methods({
    'addEmail': function (email) {
        Accounts.addEmail(Meteor.userId(), email);
        Accounts.sendVerificationEmail(Meteor.userId(), email);
    },

    'removeEmail': function (email) {
        Accounts.removeEmail(Meteor.userId(), email);
    }
});

