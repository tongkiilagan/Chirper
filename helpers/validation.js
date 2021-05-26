
const { check } = require('express-validator');


const validation = 
{

    signupValidation: function () {
        var validation = [

            check('username', 'Please enter a username.').notEmpty(),
            check('password', 'Passwords should contain at least 8 characters.').isLength({min: 8}),
            check('email', 'Please enter an email.').notEmpty(),
            check('firstname', 'Please enter a first name.').notEmpty(),
            check('lastname', 'Please enter a last name.').notEmpty(),
            check('birthday', 'Please enter a date.').notEmpty(),

        ];

        return validation;
    }
}


module.exports = validation;

