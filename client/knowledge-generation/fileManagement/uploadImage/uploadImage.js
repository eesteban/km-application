Template.uploadImage.events({
    'click #uploadImageBtn': function(){
        var files = $('#imageInput').prop("files");

        if(files.length>0){
            PictureStorage.insert(files[0], function (error, fileObj) {
                if (error) {
                    Bert.alert(TAPi18n.__('insert_picture_failure'));
                } else {
                    Meteor.call('setProfilePicture', fileObj._id);
                }
            });
        }else{
            Bert.alert(TAPi18n.__('not_picture'), 'warning')
        }
    }
});