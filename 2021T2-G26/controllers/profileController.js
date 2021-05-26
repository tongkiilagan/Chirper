const db = require('../models/db.js');
const User = require('../models/UserModel.js');
const Post = require('../models/PostModel.js');
const Comment = require('../models/CommentModel.js');
const mongoose = require('mongoose');

const profileController =
{
    // HTTP GET request whenever the user wants to view '/profile/:username'
    getProfile: function(req, res)
    {
        var query = { _id: req.session.userID }
        var projection = "username likes"

        db.findOne(User, query, projection, function(result1)
        {
            if(result1 != null)
            {
                var details1 = { 
                    username: result1.username,
                    userID: req.session.userID,
                    likes: result1.likes
                }
                var query = { username: req.params.username }
                var projection = "_id username firstName lastName bio followers following";

                db.findOne(User, query, projection, function(result2)
                {
                    if(result2 != null)
                    {
                        var details2 =
                        {
                            isNotOwnAccount: true,
                            isFollowing: false,
                            _id: result2._id,
                            username: result2.username,
                            firstname: result2.firstName,
                            lastname: result2.lastName,
                            bio: result2.bio,
                            followers: result2.followers.length,
                            following: result2.following.length
                        }
                        // if logged in user is found in the followers array, make button into "Unfollow"

                        var arrProfileFollowers = [];
                        arrProfileFollowers = result2.followers;

                        if(arrProfileFollowers.includes(req.session.userID))
                            details2.isFollowing = true;

                        // if profile info is your own profile, dont include Follow/Unfollow button
                        if(req.session.username === details2.username)
                            details2.isNotOwnAccount = false;

                        var postQuery = { author: details2._id }
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
                        
                        db.findManyPopulate(Post, postQuery, postProjection, path, sort, function(result3)
                        {
                            var months = ["January", "February", "March", "April",
                                          "May", "June", "July", "August", 
                                          "September", "October", "November", "December"];
                            if(result3 != null)
                            {
                                var posts = [];

                                for(var i of result3)
                                {
                                    var temp =
                                    {
                                        isLiked: false,
                                        isAuthor: false,
                                        _id: i._id,
                                        author: i.author,
                                        date: months[i.date.getMonth()] + " " + i.date.getDate(),
                                        post: i.post,
                                        comments: i.comments,
                                        likes: i.likes.length
                                    };
                                    if(details1.likes.includes(temp._id))
                                        temp.isLiked = true;

                                    if(i.author.username === req.session.username)
                                        temp.isAuthor = true;
                                    
                                    var tempComments = [];
                                    for(var k of temp.comments)
                                    {
                                        var tempComment =
                                        {
                                            isAuthor: false,
                                            _id: k._id,
                                            author: k.author,
                                            date: months[k.date.getMonth()] + " " + k.date.getDate(),
                                            comment: k.comment
                                        }
                                        if(k.author.username === req.session.username)
                                            tempComment.isAuthor = true;
                                        
                                        tempComments.push(tempComment);
                                    }
                                    temp.comments = tempComments;
                                    posts.push(temp);
                                }                                   
                                var head =
                                {
                                    tabname: "Chirper / Posts by " + details2.username,
                                    navProfile: req.session.username
                                }
                                res.render('profile', 
                                {head: head, loggedinUser: details1, profileDetails: details2, result3: posts});
                            }
                        });
                    }
                    else
                    {
                        var head =
                        {
                            tabname: "Chirper / Error",
                            navProfile: req.session.username
                        }
                        res.status(404);
                        res.render('errors', {head: head, title: "Error 404: User cannot be found."});
                    }

                });
            }
        });
        
    },
    getComments: function(req, res)
    {
        var query = { _id: req.session.userID }
        var projection = "username"

        db.findOne(User, query, projection, function(result1)
        {
            if(result1 != null)
            {
                var details1 = { username: result1.username, userID: req.session.userID }
                var query = { username: req.params.username }
                var projection = "_id username firstName lastName bio followers following";

                db.findOne(User, query, projection, function(result2)
                {
                    if(result2 != null)
                    {
                        var details2 =
                        {
                            isNotOwnAccount: true,
                            isFollowing: false,
                            _id: result2._id,
                            username: result2.username,
                            firstname: result2.firstName,
                            lastname: result2.lastName,
                            bio: result2.bio,
                            followers: result2.followers.length,
                            following: result2.following.length
                        }
                        var arrProfileFollowers = [];
                        arrProfileFollowers = result2.followers;

                        if(arrProfileFollowers.includes(req.session.userID))
                            details2.isFollowing = true;
                        
                        if(req.session.username === details2.username)
                            details2.isNotOwnAccount = false;

                        var commentQuery = { author: details2._id }
                        var commentProjection = "_id author date comment"
                        var path = 
                        {
                            path: "author",
                            model: "User"
                        }
                    
                        var sort = {
                            date: -1
                        }
                        
                        db.findManyPopulate(Comment, commentQuery, commentProjection, path, sort, function(result3)
                        {
                            var months = ["January", "February", "March", "April",
                                        "May", "June", "July", "August", 
                                        "September", "October", "November", "December"];                            
                            if(result3 != null)
                            {
                                var comments = [];
                                for(var i of result3)
                                {
                                    var temp = 
                                    {
                                        isAuthor: false,
                                        _id: i._id,
                                        author: i.author,
                                        date: months[i.date.getMonth()] + " " + i.date.getDate(),
                                        comment: i.comment
                                    }
                                    if(i.author.username === req.session.username)
                                        temp.isAuthor = true;

                                    comments.push(temp);
                                }
                                var head =
                                {
                                    tabname: "Chirper / Comments by " + details2.username,
                                    navProfile: req.session.username
                                }
                                res.render('profile-comments', 
                                {head: head, loggedinUser: details1, profileDetails: details2, result3: comments});
                            }
                        });
                    }
                    else
                    {
                        var head =
                        {
                            tabname: "Chirper / Error",
                            navProfile: req.session.username
                        }
                        res.status(404);
                        res.render('errors', {head: head, title: "Error 404: User cannot be found."});
                    }

                });

            }
        });
    },
    follow: function(req, res)
    {
        var profileID = req.query.profileID;
        var userID = req.query.userID;

        //insert to profileID followers the userID
        db.updateOne(User, {_id: profileID}, {$addToSet: {followers: userID}}, function(flag1)
        {
            if(flag1)
            {
                //insert to userID following the profileID\
                db.updateOne(User, {_id: userID}, {$addToSet: {following: profileID}}, function(flag2)
                {
                    if(flag2)
                    {
                        res.send(true);
                    }
                });
            }
        });
    },
    unfollow: function(req, res)
    {
        var profileID = req.query.profileID;
        var userID = req.query.userID;
        
        db.updateOne(User, {_id: profileID}, {$pull: {followers: userID}}, function(flag1)
        {
            if(flag1)
            {
                db.updateOne(User, {_id: userID}, {$pull: {following: profileID}}, function(flag2)
                {
                    if(flag2)
                    {
                        res.send(true);
                    }
                });
                
            }
        });
    },
    getLikedPosts: function(req, res)
    {
        var query = { _id: req.session.userID }
        var projection = "username likes"

        db.findOne(User, query, projection, function(result1)
        {
            if(result1 != null)
            {
                //gjet loogged in user
                var details1 = { 
                    username: result1.username,
                    userID: req.session.userID,
                    likes: result1.likes
                }

                var query = { username: req.params.username }
                var projection = "_id username firstName lastName bio followers following likes";

                db.findOne(User, query, projection, function(result2)
                {
                    if(result2 != null)
                    {
                        var details2 =
                        {
                            isNotOwnAccount: true,
                            isFollowing: false,
                            _id: result2._id,
                            username: result2.username,
                            firstname: result2.firstName,
                            lastname: result2.lastName,
                            bio: result2.bio,
                            followers: result2.followers.length,
                            following: result2.following.length,
                            likes: result2.likes
                        }
                        // if logged in user is found in the followers array, make button into "Unfollow"

                        var arrProfileFollowers = [];
                        arrProfileFollowers = result2.followers;

                        if(arrProfileFollowers.includes(req.session.userID))
                            details2.isFollowing = true;

                        // if profile info is your own profile, dont include Follow/Unfollow button
                        if(req.session.username === details2.username)
                            details2.isNotOwnAccount = false;

                        var postQuery = { _id: {$in: details2.likes} }
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
                        
                        db.findManyPopulate(Post, postQuery, postProjection, path, sort, function(result3)
                        {
                            var months = ["January", "February", "March", "April",
                                        "May", "June", "July", "August", 
                                        "September", "October", "November", "December"];
                            if(result3 != null)
                            {
                                var posts = [];

                                for(var i of result3)
                                {
                                    var temp =
                                    {
                                        isLiked: false,
                                        isAuthor: false,
                                        _id: i._id,
                                        author: i.author,
                                        date: months[i.date.getMonth()] + " " + i.date.getDate(),
                                        post: i.post,
                                        comments: i.comments,
                                        likes: i.likes.length
                                    };
                                    if(i.author.username === req.session.username)
                                        temp.isAuthor = true;
                                    
                                    if(details1.likes.includes(temp._id))
                                        temp.isLiked = true;

                                    var tempComments = [];
                                    for(var k of temp.comments)
                                    {
                                        var tempComment =
                                        {
                                            isAuthor: false,
                                            _id: k._id,
                                            author: k.author,
                                            date: months[k.date.getMonth()] + " " + k.date.getDate(),
                                            comment: k.comment
                                        }
                                        if(k.author.username === req.session.username)
                                            tempComment.isAuthor = true;
                                        
                                        tempComments.push(tempComment);
                                    }
                                    temp.comments = tempComments;
                                    posts.push(temp);
                                }                                   
                                var head =
                                {
                                    tabname: "Chirper / Likes by " + details2.username,
                                    navProfile: req.session.username
                                }
                                res.render('profile-likes', 
                                {head: head, loggedinUser: details1, profileDetails: details2, result3: posts});
                            }
                        });
                    }
                    else
                    {
                        var head =
                        {
                            tabname: "Chirper / Error",
                            navProfile: req.session.username
                        }
                        res.status(404);
                        res.render('errors', {head: head, title: "Error 404: User cannot be found."});
                    }
                });

            }
        });
    },
    getFollowers: function(req, res)
    {
        /* 
            get loggedin user
            get profile of user in question
            get user's follower list and display all
            if loggedin user is already following, render Unfollow, else, render Follow
            
        */
        var query = { _id: req.session.userID }
        var projection = "username following"

        db.findOne(User, query, projection, function(result1)
        {
            if(result1 != null)
            {
                //gjet loogged in user
                var loggedinUser = { 
                    username: result1.username,
                    userID: req.session.userID,
                    following: result1.following
                }

                var query = { username: req.params.username }
                var projection = "_id username firstName lastName bio followers following";

                db.findOne(User, query, projection, function(result2)
                {
                    if(result2 != null)
                    {
                        var profileDetails =
                        {
                            isNotOwnAccount: true,
                            isFollowing: false,
                            _id: result2._id,
                            username: result2.username,
                            firstname: result2.firstName,
                            lastname: result2.lastName,
                            bio: result2.bio,
                            followers: result2.followers.length,
                            following: result2.following.length,
                            followers_list: result2.followers
                        }
                        // if logged in user is found in the followers array, make button into "Unfollow"

                        var arrProfileFollowers = [];
                        arrProfileFollowers = result2.followers;

                        if(arrProfileFollowers.includes(req.session.userID))
                            profileDetails.isFollowing = true;

                        // if profile info is your own profile, dont include Follow/Unfollow button
                        if(req.session.username === profileDetails.username)
                            profileDetails.isNotOwnAccount = false;

                        var userQuery = { _id: {$in: profileDetails.followers_list} }
                        var userProjection = "_id username firstName lastName bio"
                        
                        db.findMany(User, userQuery, userProjection, function(result3)
                        {
                            if(result3 != null)
                            {
                                var users = [];

                                for(var i of result3)
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
                                    };
                                    // if I am following this guy, make isFollowing true
                                    if(loggedinUser.following.includes(tempUser._id))
                                        tempUser.isFollowing = true;

                                    if(tempUser.username === req.session.username)
                                        tempUser.isNotOwnAccount = false;
                                    users.push(tempUser);
                                }
                                
                                var head =
                                {
                                    tabname: "Chirper / Followers of " + profileDetails.username,
                                    navProfile: req.session.username
                                }
                                res.render('profile-followers', 
                                {head: head, loggedinUser: loggedinUser, profileDetails: profileDetails, followerlist: users});
                            }
                        });
                    }
                    else
                    {
                        var head =
                        {
                            tabname: "Chirper / Error",
                            navProfile: req.session.username
                        }
                        res.status(404);
                        res.render('errors', {head: head, title: "Error 404: User cannot be found."});
                    }
                });

            }
        });
    },
    getFollowing: function(req, res)
    {
        var query = { _id: req.session.userID }
        var projection = "username following"

        db.findOne(User, query, projection, function(result1)
        {
            if(result1 != null)
            {
                //gjet loogged in user
                var loggedinUser = { 
                    username: result1.username,
                    userID: req.session.userID,
                    following: result1.following
                }

                var query = { username: req.params.username }
                var projection = "_id username firstName lastName bio followers following";

                db.findOne(User, query, projection, function(result2)
                {
                    if(result2 != null)
                    {
                        var profileDetails =
                        {
                            isNotOwnAccount: true,
                            isFollowing: false,
                            _id: result2._id,
                            username: result2.username,
                            firstname: result2.firstName,
                            lastname: result2.lastName,
                            bio: result2.bio,
                            followers: result2.followers.length,
                            following: result2.following.length,
                            following_list: result2.following
                        }
                        // if logged in user is found in the followers array, make button into "Unfollow"

                        var arrProfileFollowers = [];
                        arrProfileFollowers = result2.followers;

                        if(arrProfileFollowers.includes(req.session.userID))
                            profileDetails.isFollowing = true;

                        // if profile info is your own profile, dont include Follow/Unfollow button
                        if(req.session.username === profileDetails.username)
                            profileDetails.isNotOwnAccount = false;

                        var userQuery = { _id: {$in: profileDetails.following_list} }
                        var userProjection = "_id username firstName lastName bio"
                        
                        db.findMany(User, userQuery, userProjection, function(result3)
                        {
                            if(result3 != null)
                            {
                                var users = [];

                                for(var i of result3)
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
                                    };
                                    // if I am following this guy, make isFollowing true
                                    if(loggedinUser.following.includes(tempUser._id))
                                        tempUser.isFollowing = true;
                                    //console.log("am i following? " + tempUser.username + ", " + tempUser.isFollowing);
                                    
                                    if(tempUser.username === req.session.username)
                                        tempUser.isNotOwnAccount = false;
                                    users.push(tempUser);
                                }
                                
                                var head =
                                {
                                    tabname: "Chirper / Followings of " + profileDetails.username,
                                    navProfile: req.session.username
                                }
                                res.render('profile-following', 
                                {head: head, loggedinUser: loggedinUser, profileDetails: profileDetails, followinglist: users});
                            }
                        });
                    }
                    else
                    {
                        var head =
                        {
                            tabname: "Chirper / Error",
                            navProfile: req.session.username
                        }
                        res.status(404);
                        res.render('errors', {head: head, title: "Error 404: User cannot be found."});
                    }
                });

            }
        });
    }

}
module.exports = profileController;