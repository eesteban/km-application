var publicationPattern = {
    title: String,
    body: String,
    type: Match.OneOf('knowledge_management', 'tutorial','process', 'rules_and_bp')
};

Meteor.publish('latestPublications', function(){
    var publications =  Publications.find({}, {'date.original':-1, limit: 5});

    if(publications){
        return publications;
    }

    return this.ready();
});

Meteor.methods({
    newPublication: function(publication){
        check(publication, publicationPattern);

        var userId = Meteor.userId();
        if(userId) {
            publication.author = userId;
            publication.date = generateDate();

            var publicationId = Publications.insert(publication);
            if(!publicationId){
                throw new Meteor.Error('new-publication', TAPi18n.__("publication_not_created"));
            }
        }
    }
});

function generateDate(){
    var date = new Date();
    var formattedDate =  date.getDate() + "/"
        + (date.getMonth()+1)  + "/"
        + date.getFullYear() + " - "
        + date.getHours() + ":"
        + (date.getMinutes()<10?'0':'') + date.getMinutes();
    console.log(formattedDate);
    return {
        original: date,
        formatted: formattedDate
    }
}
