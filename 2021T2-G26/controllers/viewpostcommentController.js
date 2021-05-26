const db = require('../models/db.js');
const User = require('../models/UserModel.js');
const Post = require('../models/PostModel.js');
const Comment = require('../models/CommentModel.js');
const mongoose = require('mongoose');
const viewpostcommentController =
{
    getPost: function(req, res)
    {
        var loggedinprojection = "likes";
        db.findOne(User, {_id: req.session.userID}, loggedinprojection, function(userDetails)
        {
            if(userDetails != null)
            {
                var postQuery = req.params.postID;
                var postProjection = "_id author date post comments likes"
                var path =
                [
                    {
                        path: "author",
                        model: "User"
                    },
                    {
                        path: "comments",
                        model: "Comment",
                        options: {sort: {'date': -1}},
                        populate: {
                            path: "author",
                            model: "User"
                        }
                    }
                ]

                if(!mongoose.Types.ObjectId.isValid(postQuery))
                {
                    var head =
                    {
                        tabname: "Chirper / Error",
                        navProfile: req.session.username
                    }
                    res.status(404);
                    res.render('errors', {head: head, title: "Error 404: Post cannot be found."});
                }
                else
                {
                    db.findOnePopulate(Post, {_id: postQuery}, postProjection, path, function(details)
                    {
                        var months = ["January", "February", "March", "April",
                                      "May", "June", "July", "August", 
                                      "September", "October", "November", "December"];    
                        if(details != null)
                        {
                            var postDetails =
                            {
                                isLiked: false,
                                isAuthor: false,
                                _id: details._id,
                                author: details.author.username,
                                post: details.post,
                                date: months[details.date.getMonth()] + " " + details.date.getDate(),
                                comments: details.comments,
                                likes: details.likes.length
                            }
                            if(userDetails.likes.includes(postDetails._id))
                                postDetails.isLiked = true;
    
                            if(postDetails.author === req.session.username)
                                postDetails.isAuthor = true;
            
                            var comments = [];
                            for(var i of postDetails.comments)
                            {
                                var tempComment =
                                {
                                    isAuthor: false,
                                    _id: i._id,
                                    author: i.author.username,
                                    date: months[i.date.getMonth()] + " " + i.date.getDate(),
                                    comment: i.comment
                                }
                                if(i.author.username === req.session.username)
                                    tempComment.isAuthor = true;
                                comments.push(tempComment);
                            }
                            postDetails.comments = comments;
                            var loggedinUser = 
                            {
                                _id: req.session.userID
                            }
                            var head =
                            {
                                tabname: "Chirper / \"" + postDetails.post + "\"",
                                navProfile: req.session.username
                            }
                            res.render('viewpost', {head: head, loggedinUser: loggedinUser, postDetails});
                        }
            
                    });
                }

            }
        });

        
    },
    getComment: function(req, res)
    {
        var commentQuery = req.params.commentID;
        var commentProjection = "_id author date comment";
        var path =
        {
            path: "author",
            model: "User"
        };

        if(!mongoose.Types.ObjectId.isValid(commentQuery))
        {
            var head =
            {
                tabname: "Chirper / Error",
                navProfile: req.session.username
            }
            res.status(404);
            res.render('errors', {head: head, title: "Error 404: Comment cannot be found."});
        }
        else
        {
            db.findOnePopulate(Comment, {_id: commentQuery}, commentProjection, path, function(result)
            {
                var months = ["January", "February", "March", "April",
                            "May", "June", "July", "August", 
                            "September", "October", "November", "December"];                
                if(result != null)
                {
                    var comment =
                    {
                        isAuthor: false,
                        _id: result._id,
                        author: result.author.username,
                        date: months[result.date.getMonth()] + " " + result.date.getDate(),
                        comment: result.comment
                    }
                    if(result.author.username === req.session.username)
                        comment.isAuthor = true;

                    var loggedinUser = req.session.username;
                    var head =
                    {
                        tabname: "Chirper / \"" + comment.comment + "\"",
                        navProfile: req.session.username
                    }
                    res.render('viewcomment', {head: head, loggedinUser: loggedinUser, result: comment});   
                }

            });
        }
    },
    getPostLikers: function(req, res)
    {
        // get postID
        var postID = req.params.postID;

        if(!mongoose.Types.ObjectId.isValid(postID))
        {
            var head =
            {
                tabname: "Chirper / Error",
                navProfile: req.session.username
            }
            res.status(404);
            res.render('errors', {head: head, title: "Error 404: Post cannot be found."});
        }
        else
        {
            // get post details
            var query = { _id: req.session.userID };
            var projection = "username following";
            db.findOne(User, query, projection, function(result1)
            {
                if(result1 != null)
                {
                    var loggedinUser = 
                    {
                        username: result1.username,
                        _id: req.session.userID,
                        following: result1.following
                    }
                    var postProjection = "likes";
                    var path =
                    [
                        {
                            path: "likes",
                            model: "User",
                        }
                    ];
                    db.findOnePopulate(Post, {_id: postID}, postProjection, path, function(result)
                    {
                        if(result != null)
                        {
                            var likers = result.likes;
                            var users = [];
                            for(var i of likers)
                            {
                                var tempUser = 
                                {
                                    isNotOwnAccount: true,
                                    isFollowing: false,
                                    _id: i._id,
                                    username: i.username,
                                    firstName: i.firstName,
                                    lastName: i.lastName,
                                    bio: i.bio                            
                                }
                                
                                if(loggedinUser.following.includes(tempUser._id))
                                    tempUser.isFollowing = true;
                                
                                if(tempUser.username === loggedinUser.username)
                                    tempUser.isNotOwnAccount = false;

                                users.push(tempUser);
                            }
                            var head =
                            {
                                tabname: "Chirper / Likes",
                                navProfile: req.session.username
                            }
                            res.render('viewpost-likers', 
                            {head: head, loggedinUser: loggedinUser, likerlist: users});                            
                        }
                    });
                }
            });       
        }
    }
}

module.exports = viewpostcommentController;