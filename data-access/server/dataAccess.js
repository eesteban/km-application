Meteor.users.allow({
    insert: function () {
        return Meteor.user().type==="admin";
    },
    update: function (userId, user) {
        return userId===user._id;
    }
});