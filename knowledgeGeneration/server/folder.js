function folder (name, path, ownerId, communityId, files, uPerm, gPerm, oPerm){
    this.path = path;
    this.owner = ownerId;
    this.community = communityId;

    this.name = name;
    this.files = files;
    this.folders = [];

    //this.setPermissions(uPerm, gPerm, oPerm);
    //
    //this.setPermissions = function(uPerm, gPerm, oPerm){
    //    if(uPerm && 0<=uPerm<=8){
    //        this.userPermissions = uPerm;
    //    }else{
    //        this.userPermissions = 7;
    //    }
    //    if(gPerm && 0<=gPerm<=8){
    //        this.groupPermissions = gPerm;
    //    }else{
    //        this.groupPermissions = 7;
    //    }
    //    if(oPerm && 0<=oPerm<=8){
    //        this.otherPermissions = oPerm;
    //    }else{
    //        this.otherPermissions = 4;
    //    }
    //};

    this.addFolder = function(folderName){
        if(this.folders.indexOf(folderName)<0){
            this.folders.push(folderName);
        }else{
            throw new Error('existing_folder');
        }
    }
}