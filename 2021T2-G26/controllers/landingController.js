const db = require('../models/db.js');
// const User = require('../models/UserModel.js');
const landingController =
{
    getLanding: function(req, res)
    {
        res.render('landing', {layout: 'login-signup'});
    }
}

module.exports = landingController;