$(document).ready(function ()
{
    $(document).on('click', '.btn.btn-primary.btn-sm.submit-comment', function()
    {
        var btn = $(this);
        var postID = $(this).closest("div").attr("id");
        var comment = $(this).prev().val();
        var author = $('#loggedin-userID').text();
        
        postID = postID.substring(7);
        var commentField = $(this).prev();
        
        // "No comments to show!" disabling
        var noCommentID = ".nocomment" + postID;
        var noComment = $(noCommentID);

        // disable button to prevent spamming
        btn.prop('disabled', true);
        // you cannot use $(this) inside AJAX for some fuanbfuoafcjn ug raeson ia dontk nwno why
        var xD = $(this);
        $.get('/addComment', {postID: postID, comment: comment, author: author}, function(result)
        {
            
            if(result != null)
            {
                //$("#post-containers").prepend(result);
                btn.prop('disabled', false);
                xD.parent('.post-form').parent('.card.card-body').prepend(result);
                commentField.val(" ");
                //errorMsg.text("Enter something valid!");
                noComment.text(" ");
            }
        });
    });
});