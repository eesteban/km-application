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
            case 'archives':
                searchParameters.archiveName=$('#archiveName').prop('checked');
                searchParameters.ownerName=$('#ownerName').prop('checked');
                searchParameters.deletedArchives=$('#deletedArchives').prop('checked');

                var archiveType = $('#archiveTypeInput').children(':selected').attr('id');
                if(archiveType!=='all'){
                    searchParameters.archiveType = archiveType;
                }
                console.log(searchParameters);

                Meteor.subscribe('search', searchParameters, function(){
                    var searchResult = search(searchParameters);
                    var searchResultSet = {
                        type: 'archives',
                        results: searchResult.fetch()
                    };
                    Session.set('searchResults', [searchResultSet]);
                });
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
    }
});

Template.searchBar.onCreated(function () {
    Session.set('searchConcept', 'users');
});

Template.searchBar.helpers({
    searchConcept: function(){
        return Session.get('searchConcept');
    },
    searchResults: function(){
        return Session.get('searchResults');
    }
});

Template.searchBar.events({
    'keyup #inputSearchBar': function(){
        delay(searchEvent(), 500);
    },
    'click .concept': function (event) {
        var searchConcept = $(event.target).attr('id');
        Session.set('searchConcept', searchConcept);
        searchEvent();
    },
    'submit #searchBarForm': function (event) {
        event.preventDefault();
    }
});

var searchEvent = function () {
    var key = $('#inputSearchBar').val();
    if(key && key !=''){
        var concept = Session.get('searchConcept');
        var searchParameters = {
            key: key,
            concept: concept
        };
        Meteor.subscribe('search', searchParameters, function(){
            var searchResult = search(searchParameters);
            var searchResultSet = {
                results: searchResult.fetch()
            };
            switch (concept) {
                case 'users':
                    searchResultSet.type= 'users';
                    break;
                case 'archives':
                    searchResultSet.type= 'archives';
                    break;
                case 'students':
                    searchResultSet.type= 'students';
                    break;
                case 'communities':
                    searchResultSet.type= 'communities';
                    break;
                case 'all':
                    return search(key);
                    break;
            }
            Session.set('searchResults', [searchResultSet]);
            $('#searchBarResults').show();
        });
    }
};

var delay = (function(){
    var timer = 0;
    return function(callback, ms){
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
    };
})();

function search(searchParameters){
    var concept = searchParameters.concept;

    switch (concept) {
        case 'users':
            return searchUsers(searchParameters);
            break;
        case 'archives':
            return searchArchives(searchParameters);
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

function searchArchives(searchParameters) {
    var mongoParameters = [];
    var key = searchParameters.key || '';
    var includeKeyRegex = {
        $regex: key,
        $options: 'i'
    };

    if(searchParameters.advancedSearch){
        if(key){
            if(searchParameters.archiveName){
                mongoParameters.push({
                    name: includeKeyRegex
                });
            }
            if(searchParameters.ownerName){
                mongoParameters.push({
                    owner: includeKeyRegex
                });
            }
        }
    }else{
        mongoParameters = [
            {name: includeKeyRegex}
        ]
    }

    var queryArray = [{$or: mongoParameters}];
    var archiveType = searchParameters.archiveType;
    if(archiveType){
        queryArray.push({type: archiveType});
    }
    if(!searchParameters.deletedArchives){
        queryArray.push({deleted: {$ne: true}});
    }

    var query;
    if(queryArray.length>1){
        query = {$and: queryArray}
    }else{
        query = queryArray
    }

    var result = Archives.find(
        query,{
            fields: {
                owner: 1,
                path: 1,
                name: 1,
                fileId: 1,
                docId: 1,
                deleted: 1,
                type: 1,
                linkType: 1,
                linkId: 1
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

