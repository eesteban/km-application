var communityPattern = {
    name: String,
    type: Match.OneOf('professional_group', 'activity_group','student_group'),
    users: [String],
    information: {
        /*Professional*/
        topics: Match.Optional([String]),
        /*Activity*/
        budget: Match.Optional({
            amount: String,
            type: Match.OneOf('total', 'per_child')
        }),
        activityType: Match.Optional(Match.OneOf('sportive','artistic', 'scientific', 'technological', 'multimedia', 'educative', 'other')),
        location: Match.Optional(String),
        studentGroups: Match.Optional([String]),
        /*Student*/
        students: Match.Optional([String])
    }
};

Meteor.publish("communitiesBasic", function () {
    var userId = this.userId;
    var communities =  Communities.find(
        {users: userId},
        {fields: {
            name: 1
        }}
    );

    if(communities){
        return communities;
    }

    return this.ready();
});

Meteor.publish("communitiesAll", function () {
    var communities =  Communities.find(
        {},
        {fields: {
            name: 1,
            type: 1,
            users: 1
        }}
    );

    if(communities){
       return communities;
    }

    return this.ready();
});

Meteor.publish("communitiesUser", function (userId) {
    check(userId, String);

    var communities =  Communities.find(
        {users: userId},
        {fields: {
            name: 1,
            type: 1,
            users: 1
        }}
    );

    if(communities){
        return communities;
    }

    return this.ready();
});

Meteor.publish("community", function (communityId) {
    check(communityId, String);

    var communities =  Communities.find(
        communityId,
        {fields: {
            name: 1,
            type: 1,
            users: 1,
            information: 1
        }}
    );

    var publish = this;
    if(communities){
        var userId = publish.userId;
        communities.forEach(function(community){
            if(!hasAccessToCommunity(community, userId)){
                return publish.ready();
            }
        });
        return communities;
    }

    return this.ready();
});


Meteor.publish("communityForum", function (communityId) {
    check(communityId, String);

    var communities =  Communities.find(
        communityId,
        {fields: {
            type: 1,
            forum: 1,
            users: 1
        }}
    );

    var publish = this;
    if(communities){
        var userId = this.userId;

        communities.forEach(function(community){
            if(!hasAccessToCommunity(community, userId)){
                return publish.ready();
            }
        });

        return communities;
    }

    return this.ready();
});

Meteor.publish("studentGroups", function () {
    var userId = this.userId;

    if(userId){
        var communities;
        if(Meteor.users.findOne(this.userId).type==='admin'){
            communities = Communities.find(
                {type: 'student_group'},
                {fields: {
                    name: 1,
                    users: 1,
                    type: 1,
                    information: 1
                }}
            );
            console.log('admin_student_group');
        }else{
            communities = Communities.find(
                {type: 'student_group', users: userId},
                {fields: {
                    name: 1,
                    users: 1,
                    type: 1,
                    information: 1
                }}
            );
        }

        if(communities){
            return communities;
        }

        return this.ready();
    }
});

Meteor.methods({
    insertCommunity: function(community){
        var userId = Meteor.userId();
        check(community, communityPattern);
        if(userId){
            var communityName = community.name;
            if(communityName && Communities.find({name: communityName}).count() < 1){
                community.users = verify(community.users, function (t) {
                    return Meteor.users.findOne({_id: t});
                });
                community.users.push(userId);
                community.createdAt = Date.now();
                community.createdBy = userId;

                var communityType = community.type;

                var information = community.information;

                if(communityType==='professional_group'){
                    information.topics = unique(information.topics);
                }else if(communityType==='activity_group'){
                    if(!information.budget){
                        information.budget={
                            amount: 0,
                            type: 'total'
                        }
                    }
                    var activityTypes = ['sportive','artistic', 'scientific', 'technological', 'multimedia', 'educative', 'other'];
                    if(inArray(information.activityType, activityTypes)<0){
                        information.activityType = 'other';
                    }
                    if(information.studentGroups){
                        information.studentGroups =  verify(information.studentGroups, function(studentGroupId) {
                            return Communities.findOne({_id: studentGroupId, type : 'student'});
                        });
                    }
                }else if(communityType==='student_group'){
                    information.students = verify(information.students, function(studentId) {
                        return Students.findOne({_id: studentId})
                    });
                }

                community.information = information;

                var communityId = Communities.insert(community);
                if(communityId){
                    community.users.forEach(function(userId){
                        Meteor.users.update(userId, {$push: {communities: communityId}});
                        /*Send Messages to the invited user*/
                    });
                    if(communityType==='activity_group'){
                        if(community.information.studentGroups){
                            community.information.studentGroups.forEach(function(studentGroupID){
                                Communities.update(studentGroupID, {$push: {'information.activities': communityId}});
                            });
                        }
                    }else if(communityType==='student_group'){
                        community.information.students.forEach(function(studentId){
                            Students.update(studentId, {$push: {'groups': communityId}});
                        });
                    }
                    console.log('Community created: ' + communityId);
                    return communityId;
                }else{
                    throw new Meteor.Error('create-community', TAPi18n.__("community_not_created"));
                }
            }{
                throw new Meteor.Error('create-community', TAPi18n.__("community_name_used"));
            }
        }else{
            throw new Meteor.Error('logged-out', TAPi18n.__("community_not_created"));
        }
    },
    newTopic: function(communityId, topic, description, post){
        check(communityId, String);
        check(topic, String);
        check(description, String);
        check(post, String);

        var userId = Meteor.userId();
        if(userId){
            if(Communities.findOne({_id: communityId, users: userId}) || Meteor.user().type==="admin"){
                var newTopic = createTopic(topic, description, post, Meteor.user());
                Communities.update(communityId, {$addToSet: {forum: newTopic}}, function(error){
                    if(error){
                        throw new Meteor.Error('create-topic', TAPi18n.__("topic_not_created"));
                    }else{
                        console.log('Topic created: ' + topic);
                    }
                });
            }else{
                throw new Meteor.Error('create-topic', TAPi18n.__("topic_not_created"));
            }

        }else{
            throw new Meteor.Error('logged-out', TAPi18n.__("topic_not_created"));
        }
    },
    newPost: function(communityId, topicIndex, post){
        check(communityId, String);
        check(topicIndex, Number);
        check(post, String);

        var userId = Meteor.userId();
        if(userId){
            var user = Meteor.user();
            if(Communities.findOne({_id: communityId, users: userId}) || user.type==="admin"){
                var newPost = createPost(post, generateDate(), user);
                var addPostExpression= {};
                var forumIndex = "forum."+topicIndex+".posts";
                addPostExpression[forumIndex] = newPost;

                Communities.update({_id: communityId}, {$addToSet: addPostExpression}, function(error){
                    if(error){
                        throw new Meteor.Error('create-post', TAPi18n.__("post_not_created"))
                    }
                });
            }else{
                throw new Meteor.Error('create-post', TAPi18n.__("post_not_created"));
            }

        }else{
            throw new Meteor.Error('logged-out', TAPi18n.__("post_not_created"));
        }
    },
    reactToPost: function(communityId, topicIndex, postIndex, reaction){
        check(communityId, String);
        check(topicIndex, Number);
        check(postIndex, Number);
        check(reaction, Match.OneOf('likes', 'dislikes'));

        var userId = Meteor.userId();
        if(userId){
            if(canReactToPost(communityId, topicIndex, postIndex, userId)){
                var likePostExpression= {};
                var usersReactedExpression = {};
                var postPath = 'forum.'+topicIndex+'.posts.'+postIndex;
                likePostExpression[postPath+'.'+reaction] = 1;
                usersReactedExpression[postPath+'.usersReacted'] = userId;
                Communities.update(communityId,  {$inc: likePostExpression, $addToSet: usersReactedExpression});
            }else{
                throw new Meteor.Error('like-post', TAPi18n.__("like_post_failure"));
            }
        }else{
            throw new Meteor.Error('logged-out', TAPi18n.__("like_post_failure"));
        }
    },
    joinCommunity: function (communityId) {
        check(communityId, String);

        var userId = Meteor.userId();
        if(userId){
            var community = Communities.findOne(communityId);
            if(community && hasAccessToCommunity(community, userId)){
                Communities.update(communityId,  {$addToSet: {users: userId}});
            }else{
                throw new Meteor.Error('join-community', TAPi18n.__("join_community_failure"));
            }
        }else{
            throw new Meteor.Error('logged-out', TAPi18n.__("post_not_created"));
        }
    },
    addStudentsToCommunity: function(communitiesId, students){
        check(communitiesId, [String]);
        check(students, [String]);

        var userId = Meteor.userId();
        if(userId){
            for(var c=0, n=communitiesId.length; c<n; c++){
                var communityId=communitiesId[c];
                var community = Communities.findOne(communityId);
                if(Meteor.user().type==="admin" && community && community.type === 'student_group'){
                    // var existingStudents = community.information.students;
                    // for(var i=0, k=existingStudents.length; i<k; i++){
                    //     for(var m=0, l=students.length; m<l; m++){
                    //         if(existingStudents[i]===students[m]){
                    //             students.splice(m, 1);
                    //             m--;
                    //         }
                    //     }
                    // }

                    if(students.length>0){
                        Communities.update(communityId, {$addToSet: {'information.students': {$each: students}}});
                    }
                }else{
                    throw new Meteor.Error('add-students', TAPi18n.__("students_not_added"));
                }
            }
        }else{
            throw new Meteor.Error('logged-out', TAPi18n.__("students_not_added"));
        }
    },
    addUsersToCommunity: function(communitiesId, users){
        check(communitiesId, [String]);
        check(users, [String]);

        var userId = Meteor.userId();
        if(userId){
            for(var c=0, n=communitiesId.length; c<n; c++){
                var communityId=communitiesId[c];
                var community = Communities.findOne(communityId);
                if(Meteor.user().type==="admin" && community && community.type === 'student_group'){
                    var existingStudents = community.users;
                    for(var i=0, k=existingStudents.length; i<k; i++){
                        for(var m=0, l=users.length; m<l; m++){
                            if(existingStudents[i]===users[m]){
                                users.splice(m, 1);
                                m--;
                            }
                        }
                    }

                    if(users.length>0){
                        Communities.update(communityId, {$addToSet: {'users': {$each: users}}});
                    }
                }else{
                    throw new Meteor.Error('add-users', TAPi18n.__("userss_not_added"));
                }
            }
        }else{
            throw new Meteor.Error('logged-out', TAPi18n.__("users_not_added"));
        }
    }
});

function createPost(text, date, user){
    return {
        author: user.profile.completeName,
        authorId: user._id,
        post: text,
        createdAt: date
    }
}

function createTopic(topic, description, post, user){
    var date = generateDate();
    var newPost = createPost(post, date, user);

    return {
        topic: topic,
        description: description,
        posts: [newPost],
        createdAt: date,
        createdBy: user._id
    };
}

function generateDate(){
    var date = new Date();
    var formattedDate =  date.getDate() + "/"
        + (date.getMonth()+1)  + "/"
        + date.getFullYear() + " - "
        + date.getHours() + ":"
        + (date.getMinutes()<10?'0':'') + date.getMinutes();
    console.log(formattedDate);
    return {
        original: date,
        formatted: formattedDate
    }
}

function hasAccessToCommunity(community, userId){
    if(community.type==='student_group'){
        return inArray(community.users, userId);
    }else{
        return true;
    }
}

function canReactToPost(communityId, topicIndex, postIndex, userId ){
    var postProjection= {};
    var forumIndex = 'forum.'+topicIndex+'.posts.'+postIndex;
    postProjection[forumIndex] = 1;
    postProjection['type'] = 1;
    postProjection['users'] = 1;

    var community = Communities.findOne(communityId, postProjection);
    if(hasAccessToCommunity(community, userId)){
        var usersReacted = community.forum[topicIndex].posts[postIndex].usersReacted;
        if(usersReacted){
            return inArray(userId, usersReacted)<0;
        }else{
            return true
        }
    }{
        return false
    }
}