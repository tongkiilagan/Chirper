  
const express = require('express');
const app = express();
const validation = require('../helpers/validation.js');

const landingController = require('../controllers/landingController.js');
const signupController = require('../controllers/signupController.js');
const loginController = require('../controllers/loginController.js');
const indexController = require('../controllers/indexController.js');
const settingsController = require('../controllers/settingsController.js');
const profileController = require('../controllers/profileController.js');
const viewpostcommentController = require('../controllers/viewpostcommentController.js');
const searchController = require('../controllers/searchController.js');
const logoutController = require('../controllers/logoutController.js');
const postcommentController = require('../controllers/postcommentController.js');

// login and signup 
app.get('/', landingController.getLanding);
app.get('/signup', signupController.getSignup);
app.get('/login', loginController.getLogin);
app.get('/home', indexController.getIndex);
app.post('/login', loginController.postLogin);
app.post('/signup', validation.signupValidation(), signupController.postSignUp);

// settings and updating information
app.get('/settings/account', settingsController.getSettingsAccount);
app.get('/settings/security', settingsController.getSettingsSecurity);
app.get('/getCheckUsername', signupController.getCheckUsername);
app.get('/getUpdateProfileInformation', settingsController.getUpdateProfileInformation);
app.get('/getUpdateUsername', settingsController.getUpdateUsername);
app.get('/getUpdateEmail', settingsController.getUpdateEmail);
app.post('/postDeleteAccount', settingsController.postDeleteAccount);
app.post('/postisMatchingPassword', settingsController.postisMatchingPassword);
app.post('/postUpdatePassword', settingsController.postUpdatePassword);

// viewing someone's profile
app.get('/profile/:username', profileController.getProfile);
app.get('/profile/:username/comments', profileController.getComments);
app.get('/profile/:username/likes', profileController.getLikedPosts);
app.get('/profile/:username/followers', profileController.getFollowers);
app.get('/profile/:username/following', profileController.getFollowing);

// viewing a Post or a Comment
app.get('/view/post/:postID', viewpostcommentController.getPost);
app.get('/view/post/:postID/likes', viewpostcommentController.getPostLikers);
app.get('/view/comment/:commentID', viewpostcommentController.getComment);

// making a search query
app.get('/searchQuery',searchController.search);
app.get('/search', searchController.getSearch);

// adding, deleting, and edting a Post or Comment
app.get('/addPost', postcommentController.addPost);
app.get('/addComment', postcommentController.addComment);
app.get('/editPost', postcommentController.editPost);
app.get('/editComment', postcommentController.editComment);
app.get('/likePost', postcommentController.likePost);
app.get('/dislikePost', postcommentController.dislikePost);
app.get('/deletePost', postcommentController.deletePost);
app.get('/deleteComment', postcommentController.deleteComment);

// Following or Unfollowing another user
app.get('/follow', profileController.follow);
app.get('/unfollow', profileController.unfollow);

// logging out
app.get('/logout', logoutController.getLanding);

module.exports = app;