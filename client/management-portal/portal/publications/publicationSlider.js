Template.publicationSlider.onCreated(function(){
    Meteor.subscribe('latestPublications');
});

Template.publicationSlider.helpers({
    latestPublications: function(){
        return Publications.find({}, {'date.original': -1, limit: 5});
    },
    selectedPublication: function(){
        var selectedPublicationId = Session.get('selectedPublicationId');
        return Publications.findOne(selectedPublicationId);
    },
    selectedPublicationId: function (){
        var selectedPublicationId =  Session.get('selectedPublicationId');
        if(!selectedPublicationId){
            var latestPublication = Publications.findOne({}, {'date.original': -1, limit: 1});
            if(latestPublication){
                Session.set('selectedPublicationId', latestPublication._id);
            }
        }else{
            return selectedPublicationId;
        }
    }
});

Template.publicationSlider.events({
    'click .publication-title': function(event){
        event.preventDefault();
        var selectedPublicationId = $(event.target).attr('id');
        console.log(selectedPublicationId);
        Session.set('selectedPublicationId', selectedPublicationId);
    }
});