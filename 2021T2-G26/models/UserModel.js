var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    
    _id:
    {
        type: mongoose.Types.ObjectId,
        default: mongoose.Types.ObjectId()
    },
    username:
    {
        type: String,
        required: true
    },
    password:
    {
        type: String,
        required: true
    },
    email:
    {
        type: String,
        required: true
    },
    firstName:
    {
        type: String,
        required: true
    },
    lastName: 
    {
        type: String,
        required: true
    },
    birthDay:
    {
        type: Date,
        required: true
    },
    bio:
    {
        type: String,
        default: " "
    },
    following:
    [
        {
            type: mongoose.Types.ObjectId,
            ref: 'users'
        }
    ],
    followers:
    [
        {
            type: mongoose.Types.ObjectId,
            ref: 'users'
        }
    ],
    likes:
    [
        {
            type: mongoose.Types.ObjectId,
            ref: 'users'
        }
    ]
});

/*
    exports a mongoose.model object based on `UserSchema` (defined above)
    when another script exports from this file
    This model executes CRUD operations
    to collection `users` -> plural of the argument `User`
*/
module.exports = mongoose.model('User', UserSchema);
