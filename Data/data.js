const mongoose = require('mongoose');
const db = require('../models/db.js');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const User = require('../models/UserModel.js');
const Post = require('../models/PostModel.js');
const Comment = require('../models/CommentModel.js');

db.connect();

var userMap = new Map([
    ["Michelle_Gubang", mongoose.Types.ObjectId()],
    ["marvin_limUwU", mongoose.Types.ObjectId()],
    ["GIGACHAD", mongoose.Types.ObjectId()],
    ["aldoMercs", mongoose.Types.ObjectId()],
    ["Tongki", mongoose.Types.ObjectId()]
]);
var postMap = new Map([
    ["9.1", mongoose.Types.ObjectId()],
    ["Weeknd", mongoose.Types.ObjectId()],
    ["#chad", mongoose.Types.ObjectId()],
    ["steak", mongoose.Types.ObjectId()],
    ["Monster", mongoose.Types.ObjectId()]
]);
var commentMap = new Map([
    ["9.1/Tongki", mongoose.Types.ObjectId()],
    ["Weeknd/Tongki", mongoose.Types.ObjectId()],
    ["Weeknd/GIGACHAD", mongoose.Types.ObjectId()],
    ["#chad/aldoMercs", mongoose.Types.ObjectId()],
    ["#chad/marvin_limUwU", mongoose.Types.ObjectId()],
]);

var users = [
    {
        _id: userMap.get("Michelle_Gubang"),
        username: "michelle_gubang",
        password: "password1",
        email: "michelle_gubang@gmail.com",
        firstName: "Michelle",
        lastName: "Gubang",
        birthDay: new Date("1997-05-01"),
        bio: "Random World of Warcraft player!"
    },
    {
        _id: userMap.get("marvin_limUwU"),
        username: "marvin_limuwu",
        password: "password2",
        email: "marvin_limuwu@gmail.com",
        firstName: "Marvin",
        lastName: "Lim",
        birthDay: new Date("1999-10-21"),
        bio: "Certified Weeb + Furry."
    },
    {
        _id: userMap.get("GIGACHAD"),
        username: "gigachad",
        password: "password3",
        email: "GIGACHAD@gmail.com",
        firstName: "GIGA",
        lastName: "CHAD",
        birthDay: new Date("1978-09-22"),
        bio: "Sup."
    },
    {
        _id: userMap.get("aldoMercs"),
        username: "aldoMercs",
        password: "password4",
        email: "aldo_mercs123@gmail.com",
        firstName: "Aldo",
        lastName: "Mercado",
        birthDay: new Date("1999-06-02"),
        bio: "Get that corn outta my face"
    },
    {
        _id: userMap.get("Tongki"),
        username: "tongki",
        password: "password5",
        email: "tongki_ilagan@gmail.com",
        firstName: "Tongki",
        lastName: "Ilagan",
        birthDay: new Date("1999-10-22"),
        bio: "EZ game = EZ life"
    }
];
var posts = [
    {
        _id: postMap.get("9.1"), 
        author: userMap.get("Michelle_Gubang"),
        date: new Date("2021-03-24"),
        post: "Can't wait for 9.1 to drop, Blood DK's could use a 100% damage increase and a +50% damage reduction bonus :D",
        comments:
        [
            commentMap.get("9.1/Tongki")
        ]
    },
    {
        _id: postMap.get("Weeknd"),
        author: userMap.get("marvin_limUwU"),
        date: new Date("2021-03-23"),
        post: "The Weeknd = trash artist",
        comments:
        [
            commentMap.get("Weeknd/Tongki"),
            commentMap.get("Weeknd/GIGACHAD")
        ]
    },
    {
        _id: postMap.get("#chad"),
        author: userMap.get("GIGACHAD"),
        date: new Date("2021-03-20"),
        post: "Why yes I do play World of Warcraft, how were you able to tell? #chad",
        comments:
        [
            commentMap.get("#chad/aldoMercs"),
            commentMap.get("#chad/marvin_limUwU")
        ]
    },
    {
        _id: postMap.get("steak"),
        author: userMap.get("aldoMercs"),
        date: new Date("2021-03-20"),
        post: "Ate a great fat steak today :D",
        comments:
        [
        ]
    },
    {
        _id: postMap.get("Monster"),
        author: userMap.get("Tongki"),
        date: new Date("2021-03-17"),
        post: "I think that Monster is the superior energy drink ngl. I try to give Redbull a chance everytime I buy it but it ends up being trash tier.",
        comments:
        [
        ]
    }
];
var comments = [
    {
        _id: commentMap.get("9.1/Tongki"),
        author: userMap.get("Tongki"),
        date: new Date("2021-03-24"),
        comment: "Yeah can't believe Blizzard hasn't done anything to balance out the dominance of VDH for the entire patch, but the addition of legendary changes and a global +10% DR is something I appreciate tho :)"     
    },
    {
        _id: commentMap.get("Weeknd/Tongki"),
        author: userMap.get("Tongki"),
        date: new Date("2021-03-24"),
        comment: "That is a completely false statement, I think he is the best artist of the century."     
    },
    {
        _id: commentMap.get("Weeknd/GIGACHAD"),
        author: userMap.get("GIGACHAD"),
        date: new Date("2021-03-24"),
        comment: "I completely agree with Tongki with what he said."     
    },
    {
        _id: commentMap.get("#chad/aldoMercs"),
        author: userMap.get("aldoMercs"),
        date: new Date("2021-03-20"),
        comment: "what a chad dude"     
    },
    {
        _id: commentMap.get("#chad/marvin_limUwU"),
        author: userMap.get("marvin_limUwU"),
        date: new Date("2021-03-21"),
        comment: "I love playing my Worgen and Vulpera characters UwU"     
    }
];


bcrypt.hash(users[0].password, saltRounds, function(err, hash)
{
    users[0].password = hash;

    bcrypt.hash(users[1].password, saltRounds, function(err, hash)
    {
        users[1].password = hash;

        bcrypt.hash(users[2].password, saltRounds, function(err, hash)
        {
            users[2].password = hash;

            bcrypt.hash(users[3].password, saltRounds, function(err, hash)
            {
                users[3].password = hash;

                bcrypt.hash(users[4].password, saltRounds, function(err, hash)
                {
                    users[4].password = hash;

                    
                    User.insertMany(users, (error, result) => {
                        Post.insertMany(posts, (error, result) => {
                            Comment.insertMany(comments, (error, result) => {
                            });
                        });
                    });

                });                
            });            
        });        
    });
});

