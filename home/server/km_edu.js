Meteor.startup(function () {
  /*Create the Admin user*/
  if(!Meteor.users.find().count()){
    var admin = {
      username: 'administrator',
      password: 'km_admin',
      type: 'admin'
    };

    var userID = Accounts.createUser(admin);
    console.log('createAdministrator - ID: ' + userID);
  }
});
