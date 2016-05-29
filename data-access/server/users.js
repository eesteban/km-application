Accounts.config({
    forbidClientAccountCreation : true
});

Accounts.onCreateUser(function(options, user){
    var date = new Date();

    user.type = options.type;
    if(options.enrolled){
        user.enrolled=options.enrolled;
    }else{
        user.enrolled=false;
    }
    if(options.profile){
        user.profile = options.profile;
    }else{
        user.profile = {}
    }
    user.createdAt = date;
    var title = 'First blog Entry';
    var body = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' +
    ' Nam porta tincidunt faucibus. Duis id est at dui volutpat luctus.' +
    ' Fusce vel nunc libero. Nulla turpis ligula, rutrum et lacus vel, faucibus aliquet justo.' +
    ' Curapbitur ultrices eu ex sit amet tristique.' +
    ' Nulla id sem tincidunt, pharetra velit efficitur, dictum risus.' +
    ' Proin rutrum tempor tellus, sit amet rhoncus lectus fringilla lacinia.' +
    ' Aenean vulputate mi at lacus consequat, at dapibus libero venenatis.' +
    ' In hac habitasse platea dictumst.' +
    ' Fusce pellentesque ligula ligula, ut eleifend ligula volutpat eget.' +
    ' Nullam nec urna eget turpis bibendum gravida. Etiam eget ipsum non purus ultricies convallis.' +
    ' Maecenas laoreet at ligula sed gravida.' +
    ' Suspendisse ex sapien, molestie vitae tristique ac, sagittis ut dui.' +
    ' Nunc lobortis mauris elit.';
    var entry = newBlogEntry(title, body);
    user.blog = {
        entries: [entry]
    };
    console.log('User created: '+ user._id);
    console.log(user);
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
        {_id: userId, enrolled: true},
        {fields: {
            emails: 1,
            profile: 1
        }}
    );

    if(user){
        return user;
    }
    return this.ready();
});

Meteor.publish("userPrivate", function () {
    var userId =  this.userId;

    if(userId){
        var currentUser =  Meteor.users.find(
            {_id: userId, enrolled: true},
            {fields: {
                username: 1,
                emails: 1,
                type: 1,
                profile: 1,
                communities: 1,
                files: 1
            }}
        );

        if(currentUser){
            return currentUser;
        }
    }

    return this.ready();
});

Meteor.publish("otherUsersEmails", function () {
    var userId = this.userId;

    var otherUserBasic =  Meteor.users.find(
        {_id: { $ne: userId}, enrolled: true},
        {fields: {
            emails: 1
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
        {_id: { $ne: userId}, enrolled: true},
        {fields: {
            'profile.image': 1,
            'profile.completeName': 1
        }}
    );

    if(otherUserBasic){
        return otherUserBasic;
    }

    return this.ready();
});

Meteor.publish("otherUsersNames", function (users) {
    check(users, [String]);
    
    var otherUsersNames =  Meteor.users.find(
        {_id: { $in: users}, enrolled: true},
        {fields: {
            'profile.completeName': 1
        }}
    );

    if(otherUsersNames){
        return otherUsersNames;
    }

    return this.ready();
});

Meteor.publish("communityUsersBasic", function (communityId) {
    check(communityId, String);

    var communityUsersBasic =  Meteor.users.find(
        {communities: communityId, enrolled: true},
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
        {_id: { $ne: userId}, enrolled: true},
        {fields: {
            emails: 1,
            profile: 1
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
        {_id: userId, enrolled: true},
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
                    'profile.surname': surname,
                    'profile.completeName': name + ' ' + surname,
                    enrolled: true
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

        var entry = newBlogEntry(title, body);
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
    addEmail: function (email) {
        check(email, String);
        console.log(email);

        var userId = Meteor.userId();
        if(Accounts.addEmail(userId, email)){
            Accounts.sendVerificationEmail(userId, email);
        }else{
            throw new Meteor.Error('email-in-use', TAPi18n.__("email_used"));
        }
    },
    removeEmail: function (email) {
        check(email, String);
        Accounts.removeEmail(Meteor.userId(), email);
    },
    verifyUserEmail: function (email) {
        check(email, String);
        if(inArray(email, Meteor.user().emails)){
            console.log('email exists:'+email);
            Accounts.sendVerificationEmail(Meteor.userId(), email);
        }else{
            throw new Meteor.Error('email-not-exist', TAPi18n.__("email_not_exist"));
        }
    },
    addPhone: function (phone) {
        check(phone, String);
        Meteor.users.update(Meteor.userId(), {$addToSet: {'profile.phones': phone}})
    },
    removePhone: function (phone) {
        check(phone, String);
        Meteor.users.update(Meteor.userId(), {$pull: {'profile.phones': phone}})
    },
    setProfilePicture: function (pictureId) {
        check(pictureId, String);

        var userId = Meteor.userId();
        if(userId){
            if(Meteor.user().profile.picture){
                //remove profile picture
                console.log('remove previous picture');
            }
            Meteor.users.update(userId, {$set: {'profile.picture': pictureId}});
        }else{
            throw new Meteor.Error('logged-out', "The profile picture can't be added");
        }
    }
});

function newBlogEntry(title, body){
    var date = new Date();
    var formattedDate =  date.getDate() + "/"
        + (date.getMonth()+1)  + "/"
        + date.getFullYear() + " - "
        + date.getHours() + ":"
        + (date.getMinutes()<10?'0':'') + date.getMinutes();
    return {
        title: title,
        body: body,
        date: {
            original: date,
            formatted: formattedDate
        },
        comments: []
    };
}