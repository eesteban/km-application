Template.selectFromCollection.onCreated(function () {
    var targetCollection = Template.instance().data.targetCollection;
    if(targetCollection==='students'){
        Meteor.subscribe('studentsComplete');
    }else if(targetCollection === 'users'){
        Meteor.subscribe('otherUsersBasic');
    }else if(targetCollection === 'studentGroups'){
        Meteor.subscribe('studentGroups');
    }
});