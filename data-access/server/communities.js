Communities = new Mongo.Collection("communities");

Communities.allow({
    insert: function (userId, community) {
        if(Communities.find({name: community.name}).count() < 1){
            return true
        }{
            throw new Meteor.Error('create-community', TAPi18n.__("community_name_used"));
        }
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

Meteor.methods({
    createCommunity: function(community){
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