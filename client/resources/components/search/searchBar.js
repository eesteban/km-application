Template.searchBar.onCreated(function () {
    Session.set('searchConcept', 'users');
});

Template.searchBar.helpers({
    searchConcept: function(){
        return Session.get('searchConcept');
    },
    searchResult: function(){
        console.log('access search result');
        return Session.get('searchResult');
    }
});

Template.searchBar.events({
    'keyup #inputSearch': function(){
        delay(function(){
            var key = $('#inputSearch').val();
            if(key && key !=''){
                var searchParameters = {
                    key: key,
                    concept: Session.get('searchConcept')
                };
                Meteor.subscribe('search', searchParameters, function(){
                    console.log('subscriptionComplete');
                    var searchResult = search(searchParameters);
                    Session.set('searchResult', searchResult.fetch());
                    console.log(Session.get('searchResult'));
                });
            }
        }, 500);
    },
    'focus #inputSearch': function(){
        $('.search-results').css('display','block');
    },
    'focusout #inputSearch': function(event){
        if($('#searchBar').has(event.target).length == 0){
            $('.search-results').css('display','none');
        }
    },
    'click .concept': function (event) {
        var searchConcept = $(event.target).attr('id');
        Session.set('searchConcept', searchConcept);
    }
});

function search (searchParameters){
    var key = searchParameters.key;
    var concept = searchParameters.concept;

    switch (concept) {
        case 'users':
            return UserIndex.search(key);
            // return Meteor.users.find({$text: {$search: key}});
            break;
        // case 'files':
        //     return searchFiles(key);
        //     break;
        // case 'students':
        //     return searchStudents(key);
        //     break;
        // case 'communities':
        //     return searchCommunitiess(key);
        //     break;
        // case 'all':
        //     return search(key);
        //     break;
        default:
            Bert.alert('not ready yet');
            break;
    }
}

var delay = (function(){
    var timer = 0;
    return function(callback, ms){
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
    };
})();
