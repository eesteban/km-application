var communityPattern = {
    name: String,
    type: Match.OneOf('professional_group', 'activity_group','student_group'),
    users: [String],
    information: {
        /*Professional*/
        topics: Match.Optional([String]),
        /*Activity*/
        budget: Match.Optional({
            amount: Number,
            type: Match.OneOf('total', 'per_child')
        }),
        activityType: Match.Optional(Match.OneOf(['sportive','artistic', 'scientific', 'technological', 'multimedia', 'educative', 'other'])),
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
    check(userId, String);

    var communities =  Communities.find(
        {users: userId},
        {fields: {
            'name': 1,
            'type': 1
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
        {_id: communityId},
        {fields: {
            'name': 1,
            'type': 1,
            'users': 1,
            'information': 1
        }}
    );

    if(communities){
        return communities;
    }

    return this.ready();
});

Meteor.publish("studentGroups", function () {
    var userId = this.userId;

    var communities =  Communities.find(
        {type: 'student_group', users: userId},
        {fields: {
            'name': 1,
            'users': 1,
            type: 1,
            'information': 1
        }}
    );

    if(communities){
        return communities;
    }

    return this.ready();
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
                        Meteor.users.update(userId, {$push: {'communities': communityId}});
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
        check(topic, String);
        check(description, String);
        check(post, String);

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
        check(communityId, String);
        check(topicIndex, Number);
        check(post, String);

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