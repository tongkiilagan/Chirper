const db = require('../models/db.js');
var mongoose = require('mongoose');

const User = require('../models/UserModel.js');
const Post = require('../models/PostModel.js');
const Comment = require('../models/CommentModel.js');
const postcommentController =
{
    addPost: function(req, res)
    {
        var newPost = 
        {
            _id: mongoose.Types.ObjectId(),
            author: req.query.author,
            post: req.query.post,
            date: new Date(),
            comments: []
        }
        db.insertOne(Post, newPost, function(flag)
        {
            var months = ["January", "February", "March", "April",
                          "May", "June", "July", "August", 
                          "September", "October", "November", "December"];     
                   
            if(flag)
            {
                newPost.author = req.session.username;
                newPost.date = months[newPost.date.getMonth()] + " " + newPost.date.getDate();
                res.render('partials/post.hbs', {
                    isAuthor: true,
                    isLiked: false,
                    _id: newPost._id,
                    author: newPost.author,
                    post: newPost.post,
                    date: newPost.date,
                    comments: newPost.comments,
                    likes: 0,
                    layout: false
                }, 
                function (err, html) {
                    res.send(html);
                });                
            }
        });
    },
    addComment: function(req,res)
    {
        var _id = mongoose.Types.ObjectId();
        var comment = req.query.comment;
        var date = new Date();
        var author = req.query.author;
        
        //insert a normal comment to Comment
        db.insertOne(Comment, {
            _id: _id, 
            date: date,
            author: author,
            comment: comment
        }, function(flag)
        {
            if(flag)
            {
                var months = ["January", "February", "March", "April",
                            "May", "June", "July", "August", 
                            "September", "October", "November", "December"];                    
                var postID = req.query.postID;
                db.updateOne(Post, {_id: postID}, 
                { $addToSet: {
                    comments: _id,
                }},
                function(result)
                {   
                    if(result)
                    {
                        res.render('partials/comment', {
                            isAuthor: true,
                            _id: _id,
                            author: req.session.username,
                            date: months[date.getMonth()] + " " + date.getDate(),
                            comment: comment,
                            layout: false
                        }, function(err, html)
                        {
                            res.send(html);
                        });
                    }
                });
            }
        });
        
    },
    deletePost: function(req, res)
    {
        var postID = req.query.postID;
        // console.log("incoming Postid: " + postID);
        db.findOne(Post, {_id: postID}, 'comments',function(result)
        {
            if(result != null)
            {
                var comments = [];
                comments = result.comments;

                db.deleteOne(Post, {_id: postID}, function(flag1)
                {
                    if(flag1)
                    {   
                        db.deleteMany(Comment, {_id: {$in: comments}}, function(flag2)
                        {
                            if(flag2)
                                res.send(true);

                        });
                    }
                });
            }
        });
    },
    deleteComment: function(req, res)
    {
        var commentID = req.query.commentID;
        // console.log("incoming commentID: " + commentID);
        db.deleteOne(Comment, {_id: commentID}, function(flag)
        {
            if(flag)
            {
                res.send(true);
            }
        });
    },
    editPost: function(req, res)
    {
        var _id = req.query._id;
        var newPost = req.query.post;

        db.updateOne(Post, {_id: _id}, {post: newPost}, function(result)
        {
            if(result)
                res.send(true);
        }); 
    },
    editComment: function(req,res)
    {
        var _id = req.query._id;
        var newComment = req.query.comment;

        db.updateOne(Comment, {_id: _id}, {comment: newComment}, function(result)
        {
            if(result)
                res.send(true);
        });
    },
    likePost: function(req, res)
    {
        var postID = req.query.postID;
        var userID = req.session.userID;
        
        db.updateOne(Post, {_id: postID}, {$addToSet: {likes: userID}}, function(flag1)
        {
            if(flag1)
            {
                db.updateOne(User, {_id: userID}, {$addToSet: {likes: postID}}, function(flag2)
                {
                    if(flag2)
                    res.send(true);
                })
            }
        });
    },
    dislikePost: function(req, res)
    {
        var postID = req.query.postID;
        var userID = req.session.userID;
        
        db.updateOne(Post, {_id: postID}, {$pull: {likes: userID}}, function(flag1)
        {
            if(flag1)
            {
                db.updateOne(User, {_id: userID}, {$pull: {likes: postID}}, function(flag2)
                {
                    if(flag2)
                    {
                        res.send(true);
                    }
                });
            }
        });
    }
}

module.exports = postcommentController;