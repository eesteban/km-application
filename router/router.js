Router.route('/', function(){
    if(!Meteor.userId()){
        this.render('home');
    }else{
        Router.go('/myProfile');
    }
});

Router.route('/myProfile', function(){
    if(!Meteor.userId()){
        Router.go('/');
    }else{
        this.layout('mainLayout');
        this.render('myProfile');
    }
});

Router.route('/managementPortal', function(){
    if(!Meteor.userId()){
        Router.go('/');
    }else{
        this.layout('mainLayout');
        this.render('administrationPanel');
    }
});

Router.route('/communities', function(){
    if(!Meteor.userId()){
        Router.go('/');
    }else {
        this.layout('mainLayout');
        this.render('createCommunity');
    }
});

Router.route('/enrollment', function(){
    this.render('enrollment');
});