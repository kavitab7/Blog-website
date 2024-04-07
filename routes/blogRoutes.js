const express = require('express');
const { getAllBlogsController, createBlogController, updateBlogController, getSingleBlogController, deleteBlogController, userBlogController, searchController } = require('../controllers/blogController');
const blogModel = require('../controllers/blogModel');
const isSignIn = require('../authMiddleware');


const router = express.Router();

// checking if a user has liked a blog post
router.get('/check-like/:id', isSignIn, async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id)
        // Get user ID from the request query or request body
        const userId = req.user._id;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }
        console.log(userId)
        const blog = await blogModel.findById(id);
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        const liked = blog.likes && blog.likes.includes(userId);// Check if the user ID is included in the likes array

        res.status(200).json({ success: true, liked, likes: blog.likes });
    } catch (error) {
        console.error('Error checking like: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// creating a comment
router.post('/comment/:id', isSignIn, async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        // Get the user ID from the request object
        const userId = req.user._id;

        const blog = await blogModel.findById(id);
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        // Create a new comment object with the user's ID
        const newComment = { content, user: userId };

        // Add the new comment to the blog's comments array
        blog.comments.push(newComment);

        // Save the blog
        await blog.save();

        res.status(201).json({ success: true, message: 'Comment added successfully' });
    } catch (error) {
        console.error('Error adding comment: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/comments/:id', isSignIn, async (req, res) => {
    try {
        const { id } = req.params;

        // Find the blog by ID and populate the 'comments.user' field
        const blog = await blogModel.findById(id).populate({
            path: 'comments',
            populate: [{
                path: 'user',
                select: 'username'
            }, {
                path: 'replies',
                populate: { path: 'user', select: 'username' }
            }]
        });

        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        // Map over each comment and reply to format the response with usernames
        const formattedComments = blog.comments.map(comment => ({
            content: comment.content,
            user: comment.user,
            _id: comment._id,
            createdAt: comment.createdAt,
            replies: comment.replies.map(reply => ({
                content: reply.content,
                _id: reply._id,
                createdAt: reply.createdAt,
                user: reply.user?.username  // Handle case where user is not found
            })),
            // Handle case where user is not found
        }));

        res.status(200).json({ success: true, comments: formattedComments });
    } catch (error) {
        console.error('Error getting comments: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// creating a like
router.post('/like/:id', isSignIn, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const blog = await blogModel.findById(id);
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        blog.likes.push(userId);
        await blog.save();

        res.status(201).json({ success: true, message: 'Like added successfully' });
    } catch (error) {
        console.error('Error adding like: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// replying to a comment
router.post('/comment/:id/reply', isSignIn, async (req, res) => {
    try {
        const { id } = req.params;
        const { commentId, content } = req.body;
        // Get the user ID from the request object
        const userId = req.user._id;
        const blog = await blogModel.findById(id);
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        const comment = blog.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        comment.replies.push({ content, user: userId });
        await blog.save();

        res.status(201).json({ success: true, message: 'Reply added successfully' });
    } catch (error) {
        console.error('Error adding reply: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// searching blogs by title
router.get('/search', searchController)

//get all blogs
router.get('/all-blogs', getAllBlogsController)


//create blog
router.post('/create-blog', isSignIn, createBlogController)

//update blog 
router.put('/update-blog/:id', isSignIn, updateBlogController)

//get single blog
router.get('/get-blog/:id', getSingleBlogController);

//delete blog
router.delete('/delete-blog/:id', isSignIn, deleteBlogController)

//get user blog
router.get('/user-blog/:id', userBlogController)

module.exports = router;