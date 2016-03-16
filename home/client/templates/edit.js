var editEnabled = false;

Template.registerHelper("edit", function (){
    return editEnabled;
});

Template.edit.events({
    'click #edit': function (event){
        event.preventDefault();
        console.log('CLick edit');
        if(editEnabled){
            editEnabled = false;
            $('#edit').css('text-decoration', 'line-through');
        }else{
            editEnabled = true;
            $('#edit').css('text-decoration', 'none');
        }
    }
});