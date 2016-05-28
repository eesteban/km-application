Router.route('/', {
    name: 'home',
    template: 'home',
    layoutTemplate: 'simpleLayout',
    onBeforeAction: function(){
        if(Meteor.userId()){
            Router.go('/myProfile');
        }else {
            this.next();
        }
    },
    action: function(){
        this.render();
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
    onBeforeAction: function(){
        if(Meteor.userId()){
            this.next();
        }else {
            Router.go('/');
        }
    },
    action: function(){
        this.render();
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
    onBeforeAction: function(){
        if(Meteor.userId()){
            this.next();
        }else {
            Router.go('/');
        }
    },
    action: function(){
        this.render();
    }
});

Router.route('/community/:_id', {
    name: 'community',
    template: 'community',
    layoutTemplate: 'mainLayout',
    waitOn: function(){
        return this.subscribe('community', this.params._id);
    },
    data: function(){
        return {
            community: Communities.findOne(this.params._id)
        }
    },
    onBeforeAction: function(){
        if(Meteor.userId()){
            Session.set('currentCommunity', this.params._id);
            this.next();
        }else {
            Router.go('/');
        }
    },
    action: function(){
        this.render();
    }
});

Router.route('/users', {
    name: 'users',
    template: 'users',
    layoutTemplate: 'mainLayout',
    waitOn: function(){
        return this.subscribe('otherUsersBasic');
    },
    onBeforeAction: function(){
        if(Meteor.userId()){
            this.next();
        }else {
            Router.go('/');
        }
    },
    action: function(){
        this.render();
    }
});

Router.route('/students', {
    name: 'students',
    template: 'students',
    layoutTemplate: 'mainLayout',
    waitOn: function(){
        return this.subscribe('userStudents');
    },
    onBeforeAction: function(){
        if(Meteor.userId()){
            this.next();
        }else {
            Router.go('/');
        }
    },
    action: function(){
        this.render();
    }
});

Router.route('/student/:_id', {
    name: 'student',
    template: 'studentProfile',
    layoutTemplate: 'mainLayout',
    waitOn: function(){
        return [
            this.subscribe('studentGroups'),
            this.subscribe('userPrivate'),
            this.subscribe('studentComplete', this.params._id)
        ];
    },
    data: function(){
        return Students.findOne(this.params._id);
    },
    onBeforeAction: function(){
        if(Meteor.userId()){
            this.next();
        }else {
            Router.go('/');
        }
    },
    action: function(){
        this.render();
    }
});

Router.route('/management', {
    name: 'management',
    template: 'managementDashboard',
    layoutTemplate: 'mainLayout',
    waitOn: function(){
        return this.subscribe('userPrivate');
    },
    onBeforeAction: function(){
        console.log(Meteor.user().type);
        if(Meteor.user().type==='admin'){
            this.next();
        }else {
            Router.go('/');
        }
    },
    action: function() {
        this.render();
    }
});

Router.route('/communities', {
    name: 'communities',
    template: 'communities',
    layoutTemplate: 'mainLayout',
    onBeforeAction: function(){
        if(Meteor.userId()){
            this.next();
        }else {
            Router.go('/');
        }
    },
    action: function(){
        this.render();
    }
});