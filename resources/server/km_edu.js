var user1Id;
var user2Id;
var user3Id;

Meteor.startup(function () {
  /*Create the Admin user*/
  if(!Meteor.users.find().count()){
    var admin = {
      username: 'administrator',
      password: 'km_admin',
      type: 'admin',
      profile : {
        name : "Endika",
        surname : "Esteban"
      }
    };

    var adminID = Accounts.createUser(admin);
    console.log('createAdministrator - ID: ' + adminID);
  }
});

Meteor.methods({
    fastSetup: function(){
        var userIdArray = createUsers(Meteor.userId(), 4);

        var studentIdArray = createStudents(5);

        var communityIdArray = createCommunities(userIdArray, studentIdArray, 4);
    }
});

function createUsers(adminId, number){
    Meteor.users.remove({_id: {$ne: adminId}});
    /*Meteor.users.update({_id: adminId},{communities:[]});*/

    console.log('Creating users');
    var userIdArray = [];
    for(var i=0; i<number;i++){
        var user= {
            type : "staff",
            username : "UserN"+i,
            profile : {
                name : "Name"+i,
                surname : "Surname"+i
            },
            password: "12345678"
        };
        userIdArray.push(Accounts.createUser(user));
    }

    console.log('Users created: '+ userIdArray);
    return userIdArray;
}

function createStudents(number){
    Students.remove({});

    console.log('Creating students');
    var studentIdArray = [];
    for(var i=0; i<number;i++){
        var name = "Student";
        var surname = "Number"+ i;
        studentIdArray.push(Meteor.call('insertStudent', name, surname));
    }

    console.log('Students created: '+ studentIdArray);
    return studentIdArray;
}

function createCommunities(userIdArray, studentIdArray, number){
    Communities.remove({});
    var communityIdArray = [];
    var communityTypes = ['professional_group', 'activity_group', 'student_group'];
    var totalUsers = userIdArray.length;
    var totalStudents = studentIdArray.length;

    console.log('Creating communities');
    for(var i=0; i<number;i++){
        var numberOfUsers = Math.floor(Math.random()*(totalUsers-1))+1;
        var communityUsers = [];
        for (var k=0; k<numberOfUsers;k++){
            var index = Math.floor(Math.random()*(totalUsers));
            communityUsers.push(userIdArray[index]);
        }

        var type = communityTypes[Math.floor(Math.random()*2)];
        var community = {
            "name" : "Community "+i,
            "users" : communityUsers,
            type: type
        };
        if(type==='professional_group'){
            community.topics=['topic 1', 'topic 2', 'topic 3']
        }else if(type==='activity_group'){
            community.budget= {
                amount: 150,
                type: 'per_child'
            };
            community.location = 'Location generated'
        }else if(type==='student_group'){
            var numberOfStudents = Math.floor(Math.random()*(totalStudents-1))+1;
            var communityStudents = [];
            for (var m=0; k<numberOfStudents;k++){
                var stdIndex = Math.floor(Math.random()*(totalStudents));
                communityStudents.push(studentIdArray[stdIndex]);
            }
            community.students = communityStudents;
        }

        var communityId = Meteor.call('insertCommunity', community);

        var numberOfTopics = Math.floor(Math.random()*2);
        for(var n=0; k<numberOfTopics;k++){
            Meteor.call('newTopic', communityId, 'New Topic '+ k, 'This is the description', 'The first Post');
        }

        communityIdArray.push(communityId)
    }

    console.log('Communities created: '+ communityIdArray);
    return communityIdArray;
}


