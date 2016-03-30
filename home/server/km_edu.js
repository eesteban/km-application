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

    var user1= {
      type : "staff",
      username : "UserN1",
      profile : {
        name : "Jhon",
        surname : "Kennedy"
      },
      password: "12345678"
    };
    user1Id = Accounts.createUser(user1);

    var user2= {
      type : "staff",
      username : "UserN2",
      profile : {
        name : "Lusvi",
        surname : "Pavli"
      },
      password: "12345678"
    };
    user2Id =Accounts.createUser(user2);

    var user3= {
      type : "staff",
      username : "UserN3",
      profile : {
        name : "Valadimir",
        surname : "Lenin"
      },
      password: "12345678"
    };
    user3Id =Accounts.createUser(user3);

  }
});

Meteor.methods({
    communitySetup: function(){
        Communities.remove({});
        console.log('Clean Communities');
        var community1 = {
            "name" : "Community 1",
            "type" : "activity",
            "users" : [
                user1Id,
                user2Id
            ]
        };
        var community1Id = Meteor.call('insertCommunity', community1);
        Meteor.call('newTopic', community1Id, 'New Topic 1', 'This is the description', 'My first Post');
        Meteor.call('newTopic', community1Id, 'New Topic 2', 'This is the description 2', 'My second Post');

        var community2 = {
            "name" : "Community 2",
            "type" : "professional",
            "users" : [
                user3Id,
                user1Id
            ]
        };

        var community2Id = Meteor.call('insertCommunity', community2);
        Meteor.call('newTopic', community2Id, 'New Topic Com 2', 'This is the description', 'My first Post');

    }
});
