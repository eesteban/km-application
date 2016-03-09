Meteor.startup(function () {
  /*Create the Admin user*/
  if(!Meteor.users.find().count()){
    var admin = {
      username: 'administrator',
      password: 'km_admin',
      profile: {
        type: 'admin'
      }
    };

    Accounts.createUser(admin);
  }
});
