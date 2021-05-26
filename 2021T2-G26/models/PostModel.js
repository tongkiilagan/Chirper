var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
    
    _id:
    {
        type: mongoose.Types.ObjectId,
        default: mongoose.Types.ObjectId()
    },
    author:
    {
        type: mongoose.Types.ObjectId,
        ref: 'users'
    },
    date:
    {
        type: Date,
        default: Date.now()
    },
    post:
    {
        type: String,
        required: true
    },
    comments:
    [
        {
            type: mongoose.Types.ObjectId,
            ref: 'comments'
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
module.exports = mongoose.model('Post', PostSchema);
