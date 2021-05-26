$(document).ready(function () {
    // Changes the user's First and Last names and bio
    $('#editProfileInformation-save').click(function()
    {

        var data =
        {
            userID: $('#settings-accountID').text(),
            newfirstName: $('#inputFirstName').val(),
            newlastName: $('#inputLastName').val(),
            newBio:$('#bio').val() 
        }
        
        $.get('/getUpdateProfileInformation', data, function(result)
        {
            if(result)
            {
                $('#editProfileInformation-success').text("Your changes have been saved!");
            }

        })
    });
    // Checks if the requested username is taken
    $('#newUsername').keyup(function () {

        var username = $('#newUsername').val();

        $.get('/getCheckUsername', {username: username}, function (result) {

            if(result.username === username) {
                $('#newUsername').css('background-color', '#EB4D42');
                $('#changeusername-save').prop('disabled', true);
                $('#editChangeUsername-isUserTaken').text("Username is already taken!");
            }

            else {
                $('#newUsername').css('background-color', '#E3E3E3');
                $('#changeusername-save').prop('disabled', false);
                $('#editChangeUsername-isUserTaken').text("");
            }
        });
    });
    // Changes the user's username
    $('#changeusername-save').click(function()
    {
        var data =
        {
            userID: $('#settings-accountID').text(),
            username: $('#newUsername').val()
        }
        $.get('/getUpdateUsername', data, function(result)
        {
            if(result)
            {
                $('#editChangeUsername-success').text("Username successfully changed!");
                window.location.href ='/settings/account';
            }
        })

        
    });
    // Delete's the user's account
    $('#deleteAccount-confirm').click(function()
    {
        var data =
        {
            password1: $('#inputPassword').val(),
            password2: $('#inputConfirmPassword').val()
        }
        if(data.password1 === data.password2)
        {
            $.post('/postisMatchingPassword', {password: data.password1}, function(result)
            {
                if(result)
                {
                    $('#isSamePassword').text(" ");
                    //delete account
                    $.post('/postDeleteAccount', function(result)
                    {
                        window.location.href ='/logout';
                    });
                    
                }
                else
                {
                    $('#isCorrectPassword').text("Password is not correct.");
                }
            });
        }
        else
            $('#isSamePassword').text("Password does not match.");        
    });
    // Changes the email of the user
    $('#submit_changeEmail').click(function()
    {
        var data =
        {
            email1: $('#inputNewEmail').val(),
            email2: $('#inputConfirmEmail').val()
        }
        if(data.email1 === data.email2)
        {
            $.get('/getUpdateEmail', {email: data.email1}, function(result)
            {
                if(result)
                {
                    $('#isSameEmail').text(" ");
                    $('#edtChangeEmail-success').text("Email successfully changed!");

                }
            });
        }
        else
        {
            $('#isSameEmail').text("Email does not match.");
        }
    });
    // Changes the user's password
    $('#changePassword-save').click(function()
    {
        var data =
        {
            oldPassword: $('#inputOldPassword').val(),
            newPassword: $('#inputNewPassword').val(),
        }
        $.post('/postisMatchingPassword', {password: data.oldPassword}, function(result)
        {
            if(result)
            {
                $('#checkifSamePassword').text(" ");
                
                if(data.newPassword.length >= 8)
                {
                    $('#checkNewPasswordLength').text(" ").
                    $.post('/postUpdatePassword', {password: data.newPassword}, function(result)
                    {
                        if(result)
                        {
                            $('#updatePasswordSuccess').text("Password has been changed!");
                            $('#inputOldPassword').text(" ");
                            $('#inputNewPassword').text(" ");
                        }
                    });
                }   
                else
                {
                    //new password is not long length
                    $('#checkNewPasswordLength').text("Password must be 8 or more characters.");
                }
            }   
            else
            {
                //old password doe not match
                $('#checkifSamePassword').text("Old password does not match.");
            }
        });
        //check if old password is correct, then check if new password is 8length
    });
});