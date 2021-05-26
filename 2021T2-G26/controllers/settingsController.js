const db = require('../models/db.js');
const User = require('../models/UserModel.js');
const Post = require('../models/PostModel.js');
const Comment = require('../models/CommentModel.js');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const settingsController =
{
    getSettingsAccount: function(req, res)
    {
        var query = {_id: req.session.userID}
        var projection = "username firstName lastName bio";
        db.findOne(User, query, projection, function(result)
        {
            if(result != null)
            {
                var details =
                {
                    _id: req.session.userID,
                    username: result.username,
                    firstname: result.firstName,
                    lastname: result.lastName,
                    bio: result.bio
                }
                var head =
                {
                    tabname: "Chirper / Account Settings",
                    navProfile: req.session.username
                }
                res.render('settings-account', {head: head, details: details});
            }
        });
    },
    getSettingsSecurity: function(req, res)
    {
        var details =
        {
            _id: req.session.userID
        }
        var head =
        {
            tabname: "Chirper / Security Settings",
            navProfile: req.session.username
        }
        res.render('settings-security', {head: head, details: details});
    },
    getUpdateProfileInformation: function(req, res)
    {
        var userID = req.query.userID;
        var firstName = req.query.newfirstName;
        var lastName = req.query.newlastName;
        var bio = req.query.newBio;

        
        db.updateOne(User, 
                    {
                        _id: userID
                    }, 
                    {
                        firstName: firstName,
                        lastName: lastName,
                        bio: bio
                    }, 
                    function(flag)
                    {
                        if(flag)
                        {
                            res.send(flag);
                        }
                            
        });
    },
    getUpdateUsername: function(req, res)
    {
        var userID = req.query.userID;
        var username = req.query.username;

    db.updateOne(User, {_id: userID}, {username: username}, function(flag)
        {
            if(flag)
            {

                req.session.username = username;
                res.redirect(200, '/settings/account');
                
            }
        });

    },
    postDeleteAccount: function(req, res)
    {
        var _id = req.session.userID;
        db.deleteOne(User, {_id: req.session.userID}, function(result)
        {
            if(result)
                db.deleteMany(Post, {author: _id}, function(result)
                {
                    if(result)
                        db.deleteMany(Comment, {author: _id}, function(result)
                        {
                            if(result)
                                db.updateMany(User, { }, {$pull: {followers: _id}}, function(result)
                                {
                                    if(result)
                                    {
                                        db.updateMany(Post, { }, {$pull: {likes: _id}}, function(result)
                                        {
                                            if(result)
                                            {
                                                res.redirect('/logout');
                                            }
                                        });
                                    }
                                });
                            
                        });
                });
        
            else
                res.send(false);
        });
    },
    postisMatchingPassword: function(req, res)
    {
        var userID = req.session.userID;
        var password = req.body.password;
        db.findOne(User, {_id: userID}, 'password', function(result)
        {
            // get the users password
            var details =
            {
                password: result.password
            }
            
            bcrypt.compare(password, details.password, function(err, equal)
            {
                if(equal)
                {
                    res.send(true);
                }
                else
                {
                    res.send(false);    
                }
            });
        });
    },
    getUpdateEmail: function(req, res)
    {
        var userID = req.session.userID;
        var newEmail = req.query.email;
        
        db.updateOne(User, {_id: userID}, {email: newEmail}, function(result)
        {
            if(result)
                res.send(true);
        })
    },
    postUpdatePassword: function(req, res)
    {
        var userID = req.session.userID;
        var newPassword = req.body.password;
        bcrypt.hash(newPassword, saltRounds, function(err, hash)
        { 
            var hashPW = hash;
            db.updateOne(User, {_id: userID}, {password: hashPW}, function(result)
            {
                if(result)
                    res.send(true);
            });
        });
    }
}
module.exports = settingsController;