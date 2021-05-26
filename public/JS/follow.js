/*
    if press 'follow'
        add user to following list
        add to user's follower's list
        change button to 'unfollow'
    else
    if press 'unfollow'
        remove user from the following list
        remove from the user's followers
        change button to 'follow'

*/
$(document).ready(function ()
{
    $(document).on('click', '#follow-unfollow', function()
    {
        var btn = $(this);
        var profileID = $('#profile-userID').text();
        var userID = $('#loggedin-userID').text();
        //get the user's _id, following and unfollowing adds/removes
        //that user's followers list with your userID
        var numFollowers = $("#numFollowers");
        btn.prop('disabled', true);

        if(btn.text() === "Follow")
        {
            //follow
            $.get('/follow', {profileID: profileID, userID: userID}, function(flag)
            {
                if(flag)
                {
                    var newFllwr = parseInt(numFollowers.text());
                    newFllwr += 1;
                    numFollowers.text(newFllwr);
                    btn.html("Unfollow");
                    btn.prop('disabled', false);
                }

            });            
        }
        else
        if(btn.text() === "Unfollow")
        {
            //unfollow 
            $.get('/unfollow', {profileID: profileID, userID: userID}, function(flag)
            {
                if(flag)
                {
                    var newFllwr = parseInt(numFollowers.text());
                    newFllwr -= 1;
                    numFollowers.text(newFllwr);
                    btn.html("Follow");
                    btn.prop('disabled', false);
                }
            });
        }
            

    });
    $('.suggested-container').on('click', '.btn.btn-outline-info.btn-sm.multi-follow', function()
    {
        var btn = $(this);

        var profileID = btn.attr("id");
        profileID = profileID.substring(6);
        var userID = $('#loggedin-userID').text();
        btn.prop('disabled', true);
        
        if(btn.text() === "Follow")
        {
            //follow
            $.get('/follow', {profileID: profileID, userID: userID}, function(flag)
            {
                if(flag)
                {
                    btn.html("Unfollow");
                    btn.prop('disabled', false);
                }

            });            
        }
        else
        if(btn.text() === "Unfollow")
        {
            //unfollow 
            $.get('/unfollow', {profileID: profileID, userID: userID}, function(flag)
            {
                if(flag)
                {
                    btn.html("Follow");
                    btn.prop('disabled', false);
                }
            });
        }                
    });
    $('.post-main').on('click', '.btn.btn-outline-info.btn-sm.multi-follow', function()
    {
        var btn = $(this);

        var profileID = btn.attr("id");
        profileID = profileID.substring(6);
        var userID = $('#loggedin-userID').text();
        btn.prop('disabled', true);

        if(btn.text() === "Follow")
        {
            //follow
            $.get('/follow', {profileID: profileID, userID: userID}, function(flag)
            {
                if(flag)
                {
                    btn.html("Unfollow");
                    btn.prop('disabled', false);
                }

            });            
        }
        else
        if(btn.text() === "Unfollow")
        {
            //unfollow 
            $.get('/unfollow', {profileID: profileID, userID: userID}, function(flag)
            {
                if(flag)
                {
                    btn.html("Follow");
                    btn.prop('disabled', false);
                }
            });
        }                
    });
    $('.card.card-body.right-panel-unit').on('click', '.btn.btn-outline-info.btn-sm.multi-follow', function()
    {
        var btn = $(this);

        var profileID = btn.attr("id");
        profileID = profileID.substring(6);
        var userID = $('#loggedin-userID').text();
        btn.prop('disabled', true);

        if(btn.text() === "Follow")
        {
            //follow
            $.get('/follow', {profileID: profileID, userID: userID}, function(flag)
            {
                if(flag)
                {
                    btn.html("Unfollow");
                    btn.prop('disabled', false);
                }
                
            });            
        }
        else
        if(btn.text() === "Unfollow")
        {
            //unfollow 
            $.get('/unfollow', {profileID: profileID, userID: userID}, function(flag)
            {
                if(flag)
                {
                    btn.html("Follow");
                    btn.prop('disabled', false);
                }
            });
        }                
    });

});