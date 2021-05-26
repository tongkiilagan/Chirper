/*
    if like
        add to loggedin user's like list
        add to the post's like list
        render the button red
    else
    if unlike
        remove from user's like list
        remove from the post's like list
        render the button to normal
*/
$(document).ready(function ()
{
    $('.btn-group.post-controls').off().on('click', '.btn.far.fa-heart', function()
    {
        var btn = $(this);
        var postID = btn.attr("id");
        postID = postID.substring(4);
        var userID = $("#loggedin-userID").text();

        // like the post
        btn.prop('disabled', true);
        if(btn.css('color') == "rgb(131, 131, 131)")
        {
            $.get('/likePost', {postID: postID}, function(result)
            {
                if(result)
                {
                    var val = parseInt(btn.text());
                    val += 1;
                    btn.text(val);
                    btn.css('color', 'red');
                    btn.prop('disabled', false);
                }
            });
        }
        else
        if(btn.css('color') == "rgb(255, 0, 0)")
        {
            $.get('/dislikePost', {postID: postID}, function(result)
            {
                if(result)
                {
                    var val = parseInt(btn.text());
                    val -= 1;
                    btn.text(val);
                    btn.css('color', 'rgb(131, 131, 131)');
                    btn.prop('disabled', false);
                }   
            });
        }
    });
});