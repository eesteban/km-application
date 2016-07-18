Template.available.helpers({
    availableOptions: function(){
        var targetCollection = Template.instance().data.targetCollection;
        if(targetCollection==='students'){
            return Students.find({selected: { $not: true}});
        }else if(targetCollection === 'users'){
            return Meteor.users.find({_id: { $ne: Meteor.userId()}, selected: { $not: true}});
        }else if(targetCollection === 'studentGroups'){
            return Communities.find({type: 'student_group', selected: { $not: true}});
        }
   },
    targetCollection: function(){
        return Template.instance().data.targetCollection;
    }
});

Template.available.events({
    'change #inputAvailableOptions': function(event){
        event.preventDefault();
        var targetCollection = Template.instance().data.targetCollection;
        var idArray = $(event.target).val();
        if(targetCollection==='students' && idArray){
            idArray.every(function(id){
                Students._collection.update(id, {$set:{ selected: true}});
            });
        }else if(targetCollection === 'users' && idArray){
            idArray.every(function(id){
                Meteor.users._collection.update(id, {$set:{ selected: true}});
            });
        }else if(targetCollection === 'studentGroups' && idArray){
            idArray.every(function(id){
                Communities._collection.update(id, {$set:{ selected: true}});
            });
        }
    }
});