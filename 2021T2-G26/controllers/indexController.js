const db = require('../models/db.js');
const User = require('../models/UserModel.js');
const Post = require('../models/PostModel.js');
const Comment = require('../models/CommentModel.js');

const indexController = 
{
    // HTTP GET request whenever the user wants to view '/home'
    getIndex: function(req, res)
    {

        var query = 
        {
            _id: req.session.userID
        }

        var projection = "username firstName lastName bio following likes";
        db.findOne(User, query, projection, function(result1)
        {
            if(result1 != null)
            {
                var details =
                {
                    username: result1.username,
                    firstname: result1.firstName,
                    lastname: result1.lastName,
                    bio: result1.bio,
                    following: result1.following,
                    likes: result1.likes
                }
                details.following.push(req.session.userID);
                var postQuery = { author: { $in: details.following} };
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
                
                var sort = {
                    date: -1
                }
                
                db.findManyPopulate(Post, postQuery, postProjection, path, sort, function(result)
                {
                    var months = ["January", "February", "March", "April",
                                  "May", "June", "July", "August", 
                                  "September", "October", "November", "December"];
                    if(result != null)
                    {
                        var post = [];

                        for(var i of result)
                        {
                            var temp =
                            {
                                isLiked: false,
                                isAuthor: false,
                                _id: i._id,
                                author: i.author.username,
                                date: months[i.date.getMonth()] + " " + i.date.getDate(),
                                post: i.post,
                                comments: i.comments,
                                likes: i.likes.length
                            };
                            if(details.likes.includes(temp._id))
                                temp.isLiked = true;

                            if(temp.author === req.session.username)
                                temp.isAuthor = true;

                            var tempComments = [];
                            for(var k of temp.comments)
                            {
                                var tempComment =
                                {
                                    isAuthor: false,
                                    _id: k._id,
                                    author: k.author.username,
                                    date: months[k.date.getMonth()] + " " + k.date.getDate(),
                                    comment: k.comment
                                }
                                if(k.author.username === req.session.username)
                                    tempComment.isAuthor = true;
                                tempComments.push(tempComment);
                            }
                            temp.comments = tempComments;                            
                            post.push(temp);
                        }
                        var suggestionProjection = "username firstName lastName";
                        var myFollowing = result1.following;

                        db.findMany(User, {_id: {$nin: myFollowing}}, suggestionProjection, function(result2)
                        {
                            var head =
                            {
                                tabname: "Chirper / Home",
                                navProfile: req.session.username,
                                userID: req.session.userID
                            }
                            res.render('home', {head: head, det1: details, result: post, result2});
                        });

                    }
                });
            }
        });
        
    },
    createPost: function(req, res)
    {
        var post = 
        {
            author: req.query.author,
            date: Date.now(),
            post: req.query.post,
            comments: req.query.comments
        }

        db.insertOne(Post, post, function(flag)
        {
            if(flag)
            {
                
            }
        })
    }
}

module.exports = indexController;