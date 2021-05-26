const db = require('../models/db.js');
const User = require('../models/UserModel.js');

const { validationResult } = require('express-validator');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const signupController =
{
    // HTTP GET request whenever the user wants to view the signup page
    getSignup: function(req, res)
    {
        res.render('signup', {layout: 'login-signup'});
    },
    // HTTP POST request whenever the user fills up the information fields
    postSignUp: function (req, res) {

        // req.body contains all data that is used with a <form> tag
  
        var errors = validationResult(req);
        if(!errors.isEmpty())
        {
            errors = errors.errors;
            var details = {};
            for(i = 0; i < errors.length; i++)
                details[errors[i].param + 'Error'] = errors[i].msg;

            res.render('signup', {layout: 'login-signup', errors: details});
        }
        else
        {
            var username = req.body.username;
            var pw = req.body.password;
            var email = req.body.email;
            var fName = req.body.firstname;
            var lName = req.body.lastname;
            var bDay = req.body.birthday;
            bcrypt.hash(pw, saltRounds, function(err, hash)
            {     
                var user = {
                    username: username,
                    password: hash,
                    email: email,
                    firstName: fName,
                    lastName: lName,
                    birthDay: bDay
                }
                
                // inserts the data into the database, and it redirects it back to the landing page
                db.insertOne(User, user, function(flag) {
                    if(flag) {
                        res.redirect('/');
                    }
                });                      
            });                
        }
    },
    getCheckUsername: function(req, res)
    {
        var usernameQuery = req.query.username;
        
        usernameQuery = "^" + usernameQuery + "$";
        db.findOne(User, {username: {$regex: usernameQuery, $options: "i"}}, 'username', function(result){
            res.send(result);
            
        });
    }
}

module.exports = signupController;