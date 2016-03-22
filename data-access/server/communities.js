Communities = new Mongo.Collection("communities");

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

Meteor.publish("communitiesComplete", function () {
    var userId = this.userId;
    var communities =  Communities.find(
        {users: userId},
        {fields: {
            'name': 1,
            'type': 1,
            'users': 1,
            'createdAt': 1
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
        if(Meteor.user().type==="admin"){
            return true;
        }else{
            //Only allow users to modify
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
            if(Communities.find({name: community.name}).count() < 1){
                community.users.push(userId);
                community.createdAt = Date.now();
                community.createdBy = userId;
                var communityId = Communities.insert(community);
                if(communityId){
                    community.users.forEach(function(userId){
                        Meteor.users.update(userId, {$push: {'communities': communityId}});
                        /*Send Messages to the invited user*/
                    });
                }else{
                    throw new Meteor.Error('create-community', TAPi18n.__("community_not_created"));
                }
            }{
                throw new Meteor.Error('create-community', TAPi18n.__("community_name_used"));
            }
        }else{
            throw new Meteor.Error('logged-out', "The community can't be created");
        }
    }
});