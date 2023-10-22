const express = require('express');
const { getAllBlogsController, createBlogController, updateBlogController, getSingleBlogController, deleteBlogController, userBlogController } = require('../controllers/blogController');

//router object 
const router = express.Router();

//get all blogs
router.get('/all-blogs', getAllBlogsController)


//create blog
router.post('/create-blog', createBlogController)

//update blog 
router.put('/update-blog/:id', updateBlogController)

//get single blog
router.get('/get-blog/:id', getSingleBlogController);

//delete blog
router.delete('/delete-blog/:id', deleteBlogController)

//get user blog
router.get('/user-blog/:id', userBlogController)

module.exports = router;