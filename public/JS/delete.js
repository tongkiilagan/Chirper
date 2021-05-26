$(document).ready(function ()
{
    $(document).on('click', '.dropdown-item.deletePost', function()
    {
        var postID = $(this).closest("div").attr("id");
        postID = postID.substring(8);

        var mainDiv = $(this).closest(".post-main");
        var commentDiv = mainDiv.next();
        $.get('/deletePost', {postID: postID}, function(result)
        {
            if(result)
            {
                commentDiv.remove();
                mainDiv.remove();
            }
                
        });

    });
    $(document).on('click', '.dropdown-item.deleteComment', function()
    {
        var commentID = $(this).closest("div").attr("id");
        commentID = commentID.substring(8);

        var mainDiv = $(this).closest(".thumbnail-post");

        $.get('/deleteComment', {commentID: commentID}, function(result)
        {
            if(result)
                mainDiv.remove();
        });
    });
});