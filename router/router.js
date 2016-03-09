Router.route('/', function(){
    if(!Meteor.userId()){
        this.render('home');
    }else{
        this.render('personalProfile');
    }
});

Router.route('/personalProfile', function(){
    this.layout('mainLayout');
    this.render('personalProfile')
});

Router.route('/managementPortal', function(){
    /*Change for management portal when finished*/
    this.render('administrationPanel');
});

Router.route('/enrollment/:token', function(){
    var token = this.params.token;
    this.render('enrollment', {
        data: {
            token: token
        }
    });
});