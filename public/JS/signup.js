$(document).ready(function () {

    $('#signup-username').keyup(function () {

        var username = $('#signup-username').val();
        console.log("Username: " + username);
        $.get('/getCheckUsername', {username: username}, function (result) {

            console.log("result: " + result.username);
            if(result.username === username) {
                $('#signup-username').css('background-color', '#EB4D42');
                $('#error').text('Username is already taken!');
                $('#submit-signup').prop('disabled', true);
            }

            else {
                $('#signup-username').css('background-color', '#E3E3E3');
                $('#submit-signup').prop('disabled', false);
                $('#error').text('');
            }
        });
    });
});
