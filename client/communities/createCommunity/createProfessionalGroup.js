Template.createProfessionalGroup.onCreated(function(){
    Session.set('topics', []);
});

Template.createProfessionalGroup.onRendered(function(){
    $('#inputTopics').keyup(function(event){
        if(event.which===188) {
            var topic = this.value.toLowerCase().replace(/[^a-z0-9]/g, '');
            var topics = Session.get('topics');
            if (topic && $.inArray(topic, topics)<0) {
                topics.push(topic);
                Session.set('topics', topics);
            }
            this.value='';
        }
    });
});

Template.createProfessionalGroup.helpers({
   topics: function(){
       return Session.get('topics');
   }
});

Template.createProfessionalGroup.events({
    'click .remove-topic': function(event){
        event.preventDefault();
        var topics = Session.get('topics');
        var topic = this.toString();
        var newTopics = $.grep(topics, function(t,i) {
            return t!==topic;
        });
        Session.set('topics', newTopics);
    }
});