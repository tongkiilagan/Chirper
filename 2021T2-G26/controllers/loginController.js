const db = require('../models/db.js');
const User = require('../models/UserModel.js');

const bcrypt = require('bcrypt');

const loginController =
{
    getLogin: function(req, res)
    {
        res.render('login', {layout: 'login-signup'});
    },
    // HTTP POST request whenever the user attempts to log in
    postLogin: function(req, res)
    {
        /*
            After the user fills up the login fields, the data of the fields is retrieved
            and is used as data for the <query>.
        */

        var username = req.body.loginusername;
        var password = req.body.loginpassword;

        var projection = '_id username password';
        db.findOne(User, {username: {$regex: "^" + username + "$", $options: "i"}}, projection, function(result)
        {
            if(result != null)
            {
                var details =
                {
                    id: result._id,
                    username: result.username,
                    pw: result.password
                };
                bcrypt.compare(password, details.pw, function(err, equal)
                {
                    if(equal)
                    {
                        req.session.userID = details.id;
                        req.session.username = details.username;
                    
                        res.redirect('/home');
                    }
                    else
                    {
                        res.render('login', {layout: 'login-signup', error: true});
                    }
                });
                /* 
                    The _id of the user is stored in a session, which is a data
                    that persists for the entire time until the user logs out.
                */
            }
            else
            {
                res.render('login', {layout: 'login-signup', error: true});
            }
        });
    }
}

module.exports = loginController;