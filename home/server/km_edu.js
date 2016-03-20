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

    var userID = Accounts.createUser(admin);
    console.log('createAdministrator - ID: ' + userID);

    var user1= {
      type : "staff",
      username : "UserN1",
      profile : {
        name : "Jhon",
        surname : "Kennedy"
      },
      password: "12345678"
    };
    Accounts.createUser(user1);

    var user2= {
      type : "staff",
      username : "UserN2",
      profile : {
        name : "Lusvi",
        surname : "Pavli"
      },
      password: "12345678"
    };
    Accounts.createUser(user2);

    var user3= {
      type : "staff",
      username : "UserN3",
      profile : {
        name : "Valadimir",
        surname : "Lenin"
      },
      password: "12345678"
    };
    Accounts.createUser(user3);
  }
});
