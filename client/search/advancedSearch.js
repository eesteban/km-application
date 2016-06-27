Template.advancedSearch.onCreated(function(){
    Session.set('searchConcept', 'users');
    Session.set('searchResults', []);
});

Template.advancedSearch.onRendered(function () {
    this.$('#fileDateTimepicker').datetimepicker();
});

Template.advancedSearch.helpers({
    searchConcept: function(){
        return Session.get('searchConcept');
    },
    searchResults: function () {
        return Session.get('searchResults');
    }
});

Template.advancedSearch.events({
    'click .concept': function (event) {
        var searchConcept = $(event.target).attr('id');
        Session.set('searchConcept', searchConcept);
    },
    'submit #searchForm': function (event) {
        event.preventDefault();
        var concept = Session.get('searchConcept');
        var searchParameters = {
            concept: concept,
            advancedSearch: true
        };
        var key = $('#inputAdvSearch').val();
        if(key){
            searchParameters.key = key;
        }

        switch (concept) {
            case 'users':
                searchParameters.userEmail=$('#userEmail').prop('checked');
                searchParameters.userName=$('#userName').prop('checked');
                searchParameters.userSurname=$('#userSurname').prop('checked');

                var userType = $('input[name=user_type]:checked').val();
                if(userType != 'any'){
                    searchParameters.userType = userType;
                }
                Meteor.subscribe('search', searchParameters, function(){
                    var searchResult = search(searchParameters);
                    var searchResultSet = {
                        type: 'users',
                        results: searchResult.fetch()
                    };
                    Session.set('searchResults', [searchResultSet]);
                });
                break;
            case 'files':
                return searchFiles(key);
                break;
            case 'students':
                Meteor.subscribe('search', searchParameters, function(){
                    console.log('subscriptionComplete');
                    var searchResult = search(searchParameters);
                    var searchResultSet = {
                        type: 'students',
                        results: searchResult.fetch()
                    };
                    Session.set('searchResults', [searchResultSet]);
                    console.log(Session.get('searchResults'));
                });
                break;
            case 'communities':
                searchParameters.communityName=$('#communityName').prop('checked');
                searchParameters.communityTopics=$('#communityTopics').prop('checked');

                var communityType = $('#communityTypeInput').children(':selected').attr('id');
                if(communityType!=='all'){
                    searchParameters.communityType = communityType;
                }
                console.log(searchParameters);

                Meteor.subscribe('search', searchParameters, function(){
                    var searchResult = search(searchParameters);
                    var searchResultSet = {
                        type: 'communities',
                        results: searchResult.fetch()
                    };
                    Session.set('searchResults', [searchResultSet]);
                });
                break;
            case 'all':
                return search(key);
                break;
        }
        // Meteor.subscribe('search', searchParameters, function(){
        //     console.log('subscriptionComplete');
        //     var searchResult = search(searchParameters);
        //     Session.set('searchResult', searchResult.fetch());
        //     console.log(Session.get('searchResult'));
        // });
    }
});

function search(searchParameters){
    var concept = searchParameters.concept;

    switch (concept) {
        case 'users':
            return searchUsers(searchParameters);
            break;
        case 'files':
            return searchFiles(searchParameters);
            break;
        case 'students':
            return searchStudents(searchParameters);
            break;
        case 'communities':
            return searchCommunities(searchParameters);
            break;
        case 'all':
            return search(searchParameters);
            break;
        default:
            return this.ready();
    }
}

function searchUsers(searchParameters){
    var mongoParameters= [];
    var key = searchParameters.key || '';
    var includeKeyRegex = {
        $regex: key,
        $options: 'i'
    };
    if(searchParameters.advancedSearch){
        if(key){
            if(searchParameters.userEmail){
                mongoParameters.push({
                    'profile.email': includeKeyRegex
                });
            }
            if(searchParameters.userSurname){
                mongoParameters.push({
                    'profile.surname': includeKeyRegex
                });
            }
            if(searchParameters.userName){
                mongoParameters.push({
                    'profile.name': includeKeyRegex
                });
            }
        }
    }else{
        mongoParameters = [
            {
                'profile.email': includeKeyRegex
            },{
                'profile.surname': includeKeyRegex
            },{
                'profile.name': includeKeyRegex
            }
        ]
    }

    var query;
    if(searchParameters.userType){
        query = {$and: [
            {$or: mongoParameters},
            {'type': searchParameters.type}
        ]};
    }else{
        query = {$or: mongoParameters};
    }
    
    var result = Meteor.users.find(
        query,{
            fields: {
                emails: 1,
                profile: 1
            }});
    console.log(result.fetch());
    return result;
}

function searchStudents(searchParameters) {
    var key = searchParameters.key || '';
    var includeKeyRegex = {
        $regex: key,
        $options: 'i'
    };

    var mongoParameters = [
        {'profile.completeName': includeKeyRegex}
    ];

    var query = {$or: mongoParameters};

    var result = Students.find(
        query, {
        fields: {
            profile: 1
        }}
    );
    console.log(result.fetch());
    return result;
}

function searchCommunities(searchParameters) {
    var mongoParameters = [];
    var key = searchParameters.key || '';
    var includeKeyRegex = {
        $regex: key,
        $options: 'i'
    };
    if(searchParameters.advancedSearch){
        if(key){
            if(searchParameters.communityName){
                mongoParameters.push({
                    name: includeKeyRegex
                });
            }
            if(searchParameters.communityTopics) {
                mongoParameters.push({
                    topics: {$in: [/key/]}
                });
            }
        }
    }else{
        mongoParameters = [
            {name: includeKeyRegex}
        ]
    }

    var query;
    var communityType = searchParameters.communityType;
    if(communityType){
        query = {$and: [
            {$or: mongoParameters},
            {type: communityType}
        ]};
    }else{
        query = {$or: mongoParameters};
    }

    var result = Communities.find(
        query,{
            fields: {
                name: 1,
                type: 1
            }}
    );
    console.log(result.fetch());
    return result;
}
