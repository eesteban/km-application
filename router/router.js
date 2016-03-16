Router.route('/', function(){
    if(!Meteor.userId()){
        this.render('home');
    }else{
        Router.go('/myProfile');
    }
});

Router.route('/myProfile', function(){
    this.layout('mainLayout');
    this.render('myProfile');
});

Router.route('/managementPortal', function(){
    this.layout('mainLayout');
    this.render('administrationPanel');
});

Router.route('/enrollment', function(){
    this.render('enrollment');
});