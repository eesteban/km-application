Meteor.publish("userData", function () {
    return Meteor.users.find(
        {_id: this.userId},
        {fields: {
            'name': 1,
            'surname': 1,
            'phones': 1,
            'emails': 1,
            'aboutMe': 1,
            'skills': 1,
            'interests': 1
        }}
    );
});