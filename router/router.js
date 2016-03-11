Router.route('/', function(){
    if(!Meteor.userId()){
        this.render('home');
    }else{
        this.render('personalProfile');
    }
});

Router.route('/personalProfile', function(){
    //this.layout('mainLayout');
    /*if(Meteor.user().updated){*/
        this.render('personalProfile');
    /*}else{
        this.render('enrollment');
    }*/
});

Router.route('/managementPortal', function(){
    this.render('administrationPanel');
});

Router.route('/enrollment', function(){
    this.render('enrollment');
});