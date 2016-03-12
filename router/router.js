Router.route('/', function(){
    if(!Meteor.userId()){
        this.render('home');
    }else{
        Router.go('/personalProfile');
    }
});

Router.route('/personalProfile', function(){
    this.layout('mainLayout');
    /*if(Meteor.user().updated){*/
        this.render('personalProfile');
    /*}else{
        this.render('enrollment');
    }*/
});

Router.route('/managementPortal', function(){
    this.layout('mainLayout');
    this.render('administrationPanel');
});

Router.route('/enrollment', function(){
    this.render('enrollment');
});