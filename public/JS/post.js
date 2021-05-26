$(document).ready(function ()
{
    $('#newPost').click(function()
    {
        var btn = $(this);

        var author = $('#loggedin-userID').text();
        var post = $('#newPostField').val();

        btn.prop('disabled', true);
        $.get('/addPost', {author: author, post: post}, function(result)
        {
            if(result != null)
            {
                btn.prop('disabled', false);
                $("#post-containers").prepend(result);
                $('#newPostField').val(" ");
            }
        });
    });
});