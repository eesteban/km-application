Template.addUserToCommunity.onCreated(function(){
    this.subscribe('otherUsersBasic');
    this.subscribe('studentGroups');
});

Template.addUserToCommunity.events({
    'click #addUserToCommunity': function () {
        var users = [];
        Meteor.users.find({selected: true}, {_id: 1}).forEach(
            function(user){
                users.push(user._id);
            }
        );

        var communities = [];
        Communities.find({selected: true}, {_id: 1}).forEach(
            function(community){
                communities.push(community._id);
            }
        );

        if (users.length > 0) {
            if (communities.length > 0) {
                Meteor.call('addUsersToCommunity', communities, users, function (error) {
                    if (error) {
                        Bert.alert(TAPi18n.__("add_users_community_failure"), 'warning')
                    } else {
                        Bert.alert(TAPi18n.__("add_users_community_success"), 'success')
                    }
                })
            } else {
                console.log('not_communities');
                Bert.alert(TAPi18n.__("add_users_community_failure"), 'warning')
            }
        } else {
            console.log('not_users');
            Bert.alert(TAPi18n.__("add_users_community_failure"), 'warning')
        }
    }
});
