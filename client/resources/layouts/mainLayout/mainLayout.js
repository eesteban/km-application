Template.mainLayout.events({
    'click': function(event){
        console.log('click');
        var container = $("#searchBar");

        if (!container.is(event.target) && container.has(event.target).length === 0) {
            $("#searchBarResults").hide();
        }else{
            $("#searchBarResults").show();
        }
    }
});