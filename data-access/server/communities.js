Meteor.publish("communitiesBasic", function () {
    var userId = this.userId;
    var communities =  Communities.find(
        {users: userId},
        {fields: {
            'name': 1
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
            'name': 1,
            'type': 1,
            'users': 1
        }}
    );

    if(communities){
       return communities;
    }

    return this.ready();
});

Meteor.publish("communitiesUser", function (userId) {
    var communities =  Communities.find(
        {users: userId},
        {fields: {
            'name': 1,
            'type': 1,
            'users': 1
        }}
    );

    if(communities){
        return communities;
    }

    return this.ready();
});

Meteor.publish("community", function (communityId) {
    var communities =  Communities.find(
        {_id: communityId},
        {fields: {
            'name': 1,
            'type': 1,
            'users': 1,
            'createdAt': 1,
            'forum': 1
        }}
    );

    if(communities){
        return communities;
    }

    return this.ready();
});

Meteor.publish("studentGroups", function () {
    var communities =  Communities.find(
        {type: 'student'},
        {fields: {
            'name': 1,
            'users': 1,
            'activities': 1
        }}
    );

    if(communities){
        return communities;
    }

    return this.ready();
});

Communities.allow({
    insert: function (userId, community) {
        if(Communities.find({name: community.name}).count() < 1){
            return true
        }{
            throw new Meteor.Error('create-community', TAPi18n.__("community_name_used"));
        }
    },
    update: function (userId, community, fields, modifier) {
        console.log('onCommunityUpdate');
        if(Meteor.user().type==="admin"){
            return true;
        }else{
            //Only allow users to modify
            return Communities.find({_id: community._id, users: userId});
        }
    },
    remove:function(){
        return Meteor.user().type==="admin";
    }
});

Meteor.methods({
    insertCommunity: function(community){
        var userId = Meteor.userId();
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

                if(communityType==='professional'){
                    community.topics = unique(community.topics);
                }else if(communityType==='activity'){
                    if(!community.budget.amount){
                        community.budget.amount = 0;
                        community.budget.type = 'total';
                    }
                    var activityTypes = ['sportive','artistic', 'scientific', 'technological', 'multimedia', 'educative', 'other'];
                    if(inArray(community.activityType, activityTypes)<0){
                        community.activityType = 'other';
                    }
                    community.studentGroups =  verify(community.studentGroups, function(t) {
                        return Communities.findOne({_id: t, type : 'student'});
                    });
                }else if(communityType==='student'){
                    community.type = 'student';
                    var students = community.students;
                    community.students = verify(students, function(t) {
                        return Students.findOne({_id: t})
                    });
                }

                var communityId = Communities.insert(community);
                if(communityId){
                    community.users.forEach(function(userId){
                        Meteor.users.update(userId, {$push: {'communities': communityId}});
                        /*Send Messages to the invited user*/
                    });
                    if(communityType==='activity'){
                        community.studentGroups.forEach(function(studentGroupID){
                            Communities.update(studentGroupID, {$push: {'activities': communityId}});
                        });
                    }else if(communityType==='student'){
                        community.students.forEach(function(studentId){
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
        var userId = Meteor.userId();
        if(userId){
            if(Communities.findOne({_id: communityId, users: userId}) || Meteor.user().type==="admin"){
                var newPost = {
                    author: Meteor.user().profile.name + ' ' + Meteor.user().profile.surname,
                    authorId: userId,
                    post: post,
                    createdAt: Date.now()
                };
                var newTopic = {
                    topic: topic,
                    description: description,
                    posts: [newPost],
                    createdAt: Date.now(),
                    createdBy: userId
                };
                Communities.update(communityId, {$addToSet: {'forum': newTopic}}, function(error){
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
        var userId = Meteor.userId();
        if(userId){
            if(Communities.findOne({_id: communityId, users: userId}) || Meteor.user().type==="admin"){
                var newPost = {
                    author: Meteor.user().profile.name + ' ' + Meteor.user().profile.surname,
                    authorId: userId,
                    post: post,
                    createdAt: Date.now()
                };
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
    }
});