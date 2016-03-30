Accounts.onCreateUser(function(options, user){
    console.log('onCreateUser');
    var date = new Date();
    user.type = options.type;
    user.profile = options.profile;
    user.createdAt = date;
    user.updated = false;
    user.blog = {
        entries: [
            {
                title: 'First blog Entry',
                date: date,
                body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' +
                ' Nam porta tincidunt faucibus. Duis id est at dui volutpat luctus.' +
                ' Fusce vel nunc libero. Nulla turpis ligula, rutrum et lacus vel, faucibus aliquet justo.' +
                ' Curabitur ultrices eu ex sit amet tristique.' +
                ' Nulla id sem tincidunt, pharetra velit efficitur, dictum risus.' +
                ' Proin rutrum tempor tellus, sit amet rhoncus lectus fringilla lacinia.' +
                ' Aenean vulputate mi at lacus consequat, at dapibus libero venenatis.' +
                ' In hac habitasse platea dictumst.' +
                ' Fusce pellentesque ligula ligula, ut eleifend ligula volutpat eget.' +
                ' Nullam nec urna eget turpis bibendum gravida. Etiam eget ipsum non purus ultricies convallis.' +
                ' Maecenas laoreet at ligula sed gravida.' +
                ' Suspendisse ex sapien, molestie vitae tristique ac, sagittis ut dui. ' +
                'Nunc lobortis mauris elit.',
                comments: []
            }
        ]
    };
    return user;
});

Meteor.users.allow({
    insert: function () {
        return Meteor.user().type==="admin";
    },
    update: function (userId, user, fields, modifier) {
        if(Meteor.user().type==="admin"){
            return true;
        }else{
            /*If the change modifies the user type deny the change*/
            if(fields.indexOf('type')<0){
                return userId===user._id;
            }else{
                return false
            }
        }
    },
    remove:function(){
        return Meteor.user().type==="admin";
    }
});

Meteor.publish("user", function (userId) {
    check(userId, String);

    var user =  Meteor.users.find(
        {_id: userId},
        {fields: {
            'emails': 1,
            'profile': 1
        }}
    );

    if(user){
        return user;
    }
    return this.ready();
});

Meteor.publish("userPrivate", function () {
    var userId =  this.userId;

    var currentUser =  Meteor.users.find(
        {_id: userId},
        {fields: {
            'username': 1,
            'emails': 1,
            'type': 1,
            'profile': 1,
            'communities': 1
        }}
    );

    if(currentUser){
        return currentUser;
    }
    return this.ready();
});

Meteor.publish("otherUsersBasic", function () {
    var userId = this.userId;

    var otherUserBasic =  Meteor.users.find(
        {_id: { $ne: userId}},
        {fields: {
            'profile.image': 1,
            'profile.name': 1,
            'profile.surname': 1
        }}
    );

    if(otherUserBasic){
        return otherUserBasic;
    }

    return this.ready();
});

Meteor.publish("communityUsersBasic", function (communityId) {
    check(communityId, String);
    var communityUsersBasic =  Meteor.users.find(
        {communities: communityId},
        {fields: {
            'profile.image': 1,
            'profile.name': 1,
            'profile.surname': 1,
            'communities': 1
        }}
    );

    if(communityUsersBasic){
        return communityUsersBasic;
    }

    return this.ready();
});

Meteor.publish("otherUsersComplete", function () {
    var userId = this.userId;
    var otherUserComplete =  Meteor.users.find(
        {_id: { $ne: userId}},
        {fields: {
            'emails': 1,
            'profile': 1
        }}
    );

    if(otherUserComplete){
        return otherUserComplete;
    }

    return this.ready();
});

Meteor.publish("blog", function (userId) {
    check(userId, String);

    var blog = Meteor.users.find(
        {_id: userId},
        {fields: {
            blog: 1
        }}
    );

    if(blog){
        return blog;
    }

    return this.ready();
});

Meteor.methods({
    addSkill: function(skill){
        var userId = Meteor.userId();
        if(userId){
            Meteor.users.update(userId, {$addToSet: {'profile.skills': skill}});
        }else{
            throw new Meteor.Error('logged-out', "The skill can't be added");
        }
    },
    addInterest: function(interest){
        var userId = Meteor.userId();
        if(userId){
            Meteor.users.update(userId, {$addToSet: {'profile.interests': interest}});
        }else{
            throw new Meteor.Error('logged-out', "The interest can't be added");
        }
    },
    newEntry: function(title, body){
        check(title, String);
        check(body, String);

        var entry = {
            title: title,
            body: body,
            date: new Date(),
            comments: []
        };
        var userId = Meteor.userId();

        if(userId){
            Meteor.users.update(userId, {$addToSet: {'blog.entries': entry}});
        }else{
            throw new Meteor.Error('logged-out', "The entry can't be added");
        }
    }
});