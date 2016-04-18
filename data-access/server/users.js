Accounts.config({
    forbidClientAccountCreation : true
});

Accounts.onCreateUser(function(options, user){
    var date = new Date();

    user.type = options.type;
    if(options.profile){
        user.profile = options.profile;
    }else{
        user.profile = {}
    }
    user.files = [];
    user.createdAt = date;
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
                ' Suspendisse ex sapien, molestie vitae tristique ac, sagittis ut dui.' +
                ' Nunc lobortis mauris elit.',
                comments: []
            }
        ]
    };

    console.log('User created: '+ user._id);
    return user;
});

Meteor.users.allow({
    insert: function () {
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
            'communities': 1,
            'files': 1
        }}
    );

    if(currentUser){
        return currentUser;
    }
    return this.ready();
});

Meteor.publish("otherUsersEmails", function () {
    var userId = this.userId;

    var otherUserBasic =  Meteor.users.find(
        {_id: { $ne: userId}},
        {fields: {
            'emails': 1
        }}
    );

    if(otherUserBasic){
        return otherUserBasic;
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
    enrollUser: function (username, name, surname){
        check(username, String);
        check(name, String);
        check(surname, String);

        var userID = Meteor.userId();
        if(userID){
            Meteor.users.update(userID,
                {$set: {
                    username: username,
                    'profile.name': name,
                    'profile.surname': surname
                }}
            );
        }else{
            throw new Meteor.Error('logged-out');
        }
    },
    addSkill: function(skill){
        var userId = Meteor.userId();
        check(skill, String);

        if(userId){
            Meteor.users.update(userId, {$addToSet: {'profile.skills': skill}});
        }else{
            throw new Meteor.Error('logged-out', "The skill can't be added");
        }
    },
    addInterest: function(interest){
        var userId = Meteor.userId();
        check(interest, String);

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
    },
    inviteUsers: function (emailList){
        check(emailList, [String]);
        emailList.forEach(function(email){
            var user = {
                email: email,
                type: 'staff'
            };
            var userId = Accounts.createUser(user);
            Accounts.sendEnrollmentEmail(userId);
        });
    },
    isAdmin: function () {
        return Meteor.user().type==="admin"
    },
    addFileUser: function(fileId, path){
        check(fileId, String);
        check(path, String);
        var userId = Meteor.userId();

        if(userId){
            var file = {
                path: path,
                owner: userId,
                fileId: fileId,
                deleted:  false
            };
            Files.insert(file, function(error){
                if(error){
                    throw new Meteor.Error('error_insert', TAPi18n.__('insert-failure'));
                }
            });
        }else{
            throw new Meteor.Error('logged-out', "The entry can't be added");
        }

    }
});