Template.createPoll.onRendered(function(){
    $('#createPollForm').validate({
        rules: {
            inputQuestion: {
                required: true
            }
        },
        messages: {
            inputQuestion: {
                required: TAPi18n.__("question_required")
            }
        },
        submitHandler: function () {
            var question = $('#inputQuestion').val();
            var multipleChoice = $('#multipleChoice').is(':checked');

            var options = [];
            var optionGroup = $('#optionGroup').children('input');
            optionGroup.each(function () {
                var value = $(this).val();
                if (value !== undefined && value !== '') {
                    options.push(value);
                }
            });

            if(options.length<2){
                Bert.alert(TAPi18n.__('not_options'), 'warning');
            }else{
                Meteor.call('addPoll', question, options, multipleChoice);
            }
        }
    })
});

Template.createPoll.events({
    'click #addOption': function(){
        console.log('addOption');
        var optionGroup = $('#optionGroup').children('input');
        var optionsFilled = true;
        optionGroup.each(function(){
            var value = $(this).val();
            if(value === undefined || value === ''){
                optionsFilled = false;
            }
        });

        if(optionsFilled){
            var newOption = $("<br><input type='text' class='form-control option'>");
            $('#optionGroup').append(newOption);
        }else{
            Bert.alert(TAPi18n.__('empty_options'), 'warning');
        }
    },
    'submit #createPollForm': function (event) {
        event.preventDefault();
    }
});