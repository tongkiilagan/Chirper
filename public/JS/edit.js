$(document).ready(function(){
    $(document).on('click', '.btn.btn-primary.editPost', function()
    {
        var postID = $(this).parent().prev("div").attr("id");
        var newPost = $(this).parent().prev("div").find("textarea").val();
        var modalName = "#editModal" + postID.substring(4);
        postID = postID.substring(4);
        

        //edit the post
        $.get('/editPost', {_id: postID, post: newPost}, function(result)
        {
            if(result)
            {
                $(modalName).modal('hide');
                $('#'+ postID).text(newPost);
            }
        });
    });
    $(document).on('click', '.btn.btn-primary.editComment', function()
    {
        var commentID = $(this).parent().prev("div").attr("id");
        var newComment = $(this).parent().prev("div").find("textarea").val();
        var modalName = "#editModal" + commentID.substring(4);
        commentID = commentID.substring(4);

        $.get('/editComment', {_id: commentID, comment: newComment}, function()
        {
            $(modalName).modal('hide');
            $('#'+ commentID).text(newComment);            
        });
    });
});