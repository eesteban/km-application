Template.selected.helpers({
    selectedOptions: function(){
        var targetCollection = Template.instance().data.targetCollection;
        if(targetCollection==='students'){
            return Students.find({selected: true});
        }else if(targetCollection === 'users'){
            return Meteor.users.find({selected: true});
        }else if(targetCollection === 'studentGroups'){
            return Communities.find({type: 'student', selected: true});
        }
    },
    targetCollection: function(){
        return Template.instance().data.targetCollection;
    }
});

Template.selected.events({
    'click .remove': function (event) {
        event.preventDefault();
        var targetCollection = Template.instance().data.targetCollection;
        var id = $(event.target).attr('id');
        if(targetCollection==='students' && id){
            Students._collection.update(id, {$unset:{selected: true}});
        }else if(targetCollection==='users' && id){
            Meteor.users._collection.update(id, {$unset:{selected: true}});
        }else if(targetCollection==='studentGroups' && id){
            Communities._collection.update(id, {$unset:{selected: true}});
        }

    }
});