Meteor.startup(function () {
    // process.env.MAIL_URL="smtp://postmaster%40patxilarrainzar.tk:95647086ce56a74218a97307e6a7e486@smtp.mailgun.org:587";
    /*Create the Admin user*/
    if(!Meteor.users.find().count()){
        var admin = {
            username: 'administrator',
            password: 'km_admin',
            type: 'admin',
            profile : {
                name : "Endika",
                surname : "Esteban",
                completeName: "Endika Esteban"
            },
            enrolled:true
        };

        var adminID = Accounts.createUser(admin);
        Accounts.addEmail(adminID, "endikae94@gmail.com");
        console.log('createAdministrator - ID: ' + adminID);
    }
    
    createIndexes();
});

function createIndexes() {
    var users_index_name = 'users_text_index';
    // Meteor.users._dropIndex(users_index_name);
    Meteor.users._ensureIndex({
        'profile.name': 'text',
        'profile.surname': 'text',
        'profile.completeName': 'text',
        'emails': 'text'
    }, {
        name: users_index_name
    });

    var communities_text_index = 'communities_text_index';
    // Communities._dropIndex(communities_text_index);
    Communities._ensureIndex({
        'name': 'text'
    }, {
        name: communities_text_index
    });

    var students_text_index = 'students_text_index';
    // Students._dropIndex(users_index_name);
    Students._ensureIndex({
        'profile.name': 'text',
        'profile.surname': 'text',
        'profile.completeName': 'text'
    }, {
        name: students_text_index
    });
}

Meteor.methods({
    fastSetup: function(){
        createOrganization();

        createUsers(Meteor.userId(), 4);
        createStudents(30);
        // var userIdArray = createUsers(Meteor.userId(), 4);
        //
        // var studentIdArray = createStudents(5);
        //
        // createCommunities(userIdArray, studentIdArray, 4);
    }
});

function createOrganization() {
    var existingOrganization = Organization.findOne();
    
    if(!existingOrganization){
        var organization = {
            information: {
                philosophy: 'Philosophy of my school',
                contact: {
                    address: 'main street 1, Paris, 75016',
                    emails: [
                        {
                            label: 'office',
                            email: 'maile@school.com'
                        }
                    ]
                }
            }
        };
        Organization.insert(organization);
    }
}


function createUsers(adminId, number){
    Meteor.users.remove({_id: {$ne: adminId}});
    /*Meteor.users.update({_id: adminId},{communities:[]});*/

    console.log('Creating users');
    // var userIdArray = [];
    // for(var i=0; i<number;i++){
    //     var user= {
    //         type : "staff",
    //         username : "UserN"+i,
    //         profile : {
    //             name : "Name"+i,
    //             surname : "Surname"+i,
    //             completeName: "Name"+i+' '+ "Surname"+i
    //         },
    //         password: "12345678",
    //         enrolled: true
    //     };
    //     userIdArray.push(Accounts.createUser(user));
    // }

    var user= {
        type : "staff",
        username : "adam123",
        profile : {
            name : "Adam",
            surname : "Smith",
            completeName: "Adam Smith"
        },
        password: "12345678",
        enrolled: true
    };
    Accounts.createUser(user);

    var user2= {
        type : "staff",
        username : "alexander123",
        profile : {
            name : "Alexander",
            surname : "Jhonson",
            completeName: "Alexander Jhonson"
        },
        password: "12345678",
        enrolled: true
    };
    Accounts.createUser(user2);

    var user3= {
        type : "staff",
        username : "emma123",
        profile : {
            name : "Emma",
            surname : "Brown",
            completeName: "Emma Brown"
        },
        password: "12345678",
        enrolled: true
    };
    Accounts.createUser(user3);

    var user4= {
        type : "staff",
        username : "mary123",
        profile : {
            name : "Mary",
            surname : "Moore",
            completeName: "Mary Moore"
        },
        password: "12345678",
        enrolled: true
    };
    Accounts.createUser(user4);

    var user5= {
        type : "staff",
        username : "rebeca123",
        profile : {
            name : "Rebeca",
            surname : "Davis",
            completeName: "Rebeca Davis"
        },
        password: "12345678",
        enrolled: true
    };
    Accounts.createUser(user5);

    var user6= {
        type : "staff",
        username : "michel123",
        profile : {
            name : "Michel",
            surname : "Anderson",
            completeName: "Michel Anderson"
        },
        password: "12345678",
        enrolled: true
    };
    Accounts.createUser(user6);
}

function createStudents(number){
    Students.remove({});

    console.log('Creating students');
    var names = ['Liam', 'Noah', 'James', 'William', 'Oliver', 'Joseph, Owen', 'Gabriel', 'Alexander',
        'Michael', 'Wyatt', 'Jackson', 'Jacob', 'Benjamin', 'Logan', 'Samuel',
        'Olivia', 'Emma', 'Aurora', 'Amelia', 'Ava', 'Abigail', 'Harper', 'Sophia',
        'Elizabeth', 'Emily', 'Evelyn', 'Hazel', 'Madison', 'Lillian', 'Scarlett'];
    var surnames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor',
        'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Martinez', 'Robinson'];
    var studentIdArray = [];
    for(var i=0, lN = names.length, lS=surnames.length; i<number;i++){
        var name = names[Math.floor((Math.random() * lN))];
        var surname = surnames[Math.floor((Math.random() * lS))];
        Meteor.call('insertStudent', name, surname);
    }
}

function createCommunities(userIdArray, studentIdArray, number){
    Communities.remove({});
    var communityIdArray = [];
    var communityTypes = ['professional_group', 'activity_group', 'student_group'];
    var totalUsers = userIdArray.length;
    var totalStudents = studentIdArray.length;

    console.log('Creating communities');
    for(var i=0; i<number;i++){
        var numberOfUsers = Math.floor(Math.random()*(totalUsers-1))+1;
        var communityUsers = [];
        for (var m=0; m<numberOfUsers;m++){
            var index = Math.floor(Math.random()*(totalUsers));
            communityUsers.push(userIdArray[index]);
        }

        var type = communityTypes[Math.floor(Math.random()*2)];
        var community = {
            name : "Community "+i,
            users : communityUsers,
            type: type
        };
        var information = {};
        if(type==='professional_group'){
            information.topics=['topic 1', 'topic 2', 'topic 3']
        }else if(type==='activity_group'){
            information.budget= {
                amount: '150',
                type: 'per_child'
            };
            information.location = 'Location generated'
        }else if(type==='student_group'){
            var numberOfStudents = Math.floor(Math.random()*(totalStudents-1))+1;
            var communityStudents = [];
            for (var n=0; n<numberOfStudents;n++){
                var stdIndex = Math.floor(Math.random()*(totalStudents));
                communityStudents.push(studentIdArray[stdIndex]);
            }
            information.students = communityStudents;
        }

        community.information=information;

        var communityId = Meteor.call('insertCommunity', community);

        var numberOfTopics = Math.floor(Math.random()*2);
        for(var k=0; k<numberOfTopics;k++){
            Meteor.call('newTopic', communityId, 'New Topic '+ k, 'This is the description', 'The first Post');
        }

        communityIdArray.push(communityId)
    }

    console.log('Communities created: '+ communityIdArray);
    return communityIdArray;
}


