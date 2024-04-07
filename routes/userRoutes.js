const express = require('express');
const { getAllUsers, loginController, registerController, followUser, unfollowUser, checkFollowStatus, getFollowingUsersBlogs } = require('../controllers/userController');
const isSignIn = require('../authMiddleware');

const router = express.Router();

//get users
router.get('/all-users', getAllUsers)

//following blogs 
router.get('/following/blogs', isSignIn, getFollowingUsersBlogs)

router.post('/follow/:userId/:userToFollowId', followUser);
router.post('/unfollow/:userId/:userToFollowId', unfollowUser);

//  follow status
router.get('/is-following/:userId/:userToCheckId', checkFollowStatus);
//create user
router.post('/register', registerController)

//login user
router.post('/login', loginController)

module.exports = router;