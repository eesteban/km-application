Router.route('/', {
    name: 'home',
    template: 'home',
    action:  function(){
        if(!Meteor.userId()){
            this.render();
        }else{
            Router.go('/myProfile');
        }
    }
});

Router.route('/myProfile',{
    name: 'myProfile',
    template: 'myProfile',
    layoutTemplate: 'mainLayout',
    subscriptions: function(){
        this.subscribe('userPrivate').wait();
    },
    data: function(){
        return {
            user: Meteor.users.findOne(Meteor.userId())
        }
    },
    action:  function(){
        if(!Meteor.userId()){
            Router.go('/');
        }else{
            this.render();
        }
    }
});

Router.route('/profile/:_id', {
    name: 'profile',
    template: 'profile',
    layoutTemplate: 'mainLayout',
    subscriptions: function(){
        this.subscribe('user', this.params._id).wait();
    },
    data: function(){
        return {
            user: Meteor.users.findOne(this.params._id)
        }
    },
    action: function(){
        if(!Meteor.userId()){
            Router.go('/');
        }else {
            this.render();
        }
    }
});

Router.route('/community/:_id', {
    name: 'community',
    template: 'community',
    layoutTemplate: 'mainLayout',
    subscriptions: function(){
        this.subscribe('community', this.params._id).wait();
    },
    data: function(){
        return {
            community: Communities.findOne(this.params._id)
        }
    },
    action: function(){
        if(!Meteor.userId()){
            Router.go('/');
        }else {
            Session.set('currentCommunity', this.params._id);
            this.render();
        }
    }
});

Router.route('/management', function(){
    if(!Meteor.userId()){
        Router.go('/');
    }else{
        this.layout('mainLayout');
        this.render('administrationPanel');
    }
});

Router.route('/communities', {
    name: 'communities',
    template: 'communities',
    layoutTemplate: 'mainLayout',
    action: function(){
        if(!Meteor.userId()){
            Router.go('/');
        }else {
            this.render();
        }
    }
});

Router.route('/enrollment', function(){
    this.render('enrollment');
});