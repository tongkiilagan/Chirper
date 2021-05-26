const db = require('../models/db.js');

const User = require('../models/UserModel.js');
const Post = require('../models/PostModel.js');
const Comment = require('../models/CommentModel.js');
const searchController =
{
    search: function(req, res)
    {
        var query = req.body.searchbar;
        res.redirect('/search?query=' + query);
    },
    getSearch: function(req, res)
    {
        var projection = "following";
        db.findOne(User, {_id: req.session.userID}, projection, function(result1)
        {
            if(result1 != null)
            {
                var arrFollowing = result1.following;

                var query = req.query.query;
                var postProjection = "_id author date post";
                var path = 
                { 
                    path: "author",
                    model: "User"
                }
                var sort = 
                {
                    date: -1
                }
                // {post: {$regex: '/' + query + '/', $options: "i"}}
                db.findManyPopulate(Post, {post: {$regex: query, $options: "i"}}, postProjection, path, sort, function(result)
                {
                    var months = ["January", "February", "March", "April",
                                  "May", "June", "July", "August", 
                                  "September", "October", "November", "December"];            
                    if(result != null)
                    {
                        var posts = [];
                        for(var i of result)
                        {
                            var tempPost = 
                            {
                                _id: i._id,
                                author: i.author,
                                date: months[i.date.getMonth()] + " " + i.date.getDate(),
                                post: i.post
                            }
                            posts.push(tempPost);
                        }
                        var userProjection = "_id username firstName lastName";
                        //{username: {$regex: "^" + query + "$", $options: "i"}}
                        db.findMany(User, {$or: 
                        [
                            {username: {$regex: query, $options: "i"}},
                            {firstName: {$regex: query, $options: "i"}},
                            {lastName: {$regex: query, $options: "i"}},
                        ]
                        }, userProjection, function(result2)
                        {
                            if(result2 != null)
                            {
                                var users = [];
                                for(var k of result2)
                                {
                                    var tempUser =
                                    {
                                        isNotOwnAccount: true,
                                        isFollowing: false,
                                        _id: k._id,
                                        username: k.username,
                                        firstName: k.firstName,
                                        lastName: k.lastName
                                    }
                                    if(arrFollowing.includes(tempUser._id))
                                        tempUser.isFollowing = true;
                                    //if this user is my own account, dont show the Follow/Unfollow
                                    if(tempUser.username === req.session.username)
                                        tempUser.isNotOwnAccount = false;
                                    
                                    users.push(tempUser);
                                }
                                var head = { 
                                    tabname: "Chirper / \"" + query + "\"",
                                    navProfile: req.session.username,
                                    _id: req.session.userID
                                };
                                res.render('search', {head:head, query: query, posts, users: users}); 
                            }
                        });
                       
                    }
                });                
            }
        });


    }
}

module.exports = searchController;