const mongoose = require('mongoose')
const blogModel = require('./blogModel')
const userModel = require('./userModel')

exports.getAllBlogsController = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 4;
    const skip = (page - 1) * limit;
    try {
        const blogs = await blogModel
            .find({})
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('user');

        const totalBlogs = await blogModel.countDocuments({});

        if (blogs.length === 0) {
            return res.status(200).send({
                success: false,
                message: 'No blogs found',
            });
        }

        const totalPages = Math.ceil(totalBlogs / limit);
        const hasMorePages = page < totalPages;

        return res.status(200).send({
            BlogCount: blogs.length,
            totalPages,
            currentPage: page,
            hasMorePages,
            success: true,
            message: 'Blogs fetched successfully',
            blogs,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error in getting all blogs',
            error,
        });
    }
};

exports.createBlogController = async (req, res) => {
    try {
        const { title, description, image, user } = req.body;
        if (!title || !description || !image || !user) {
            return res.status(400).send({
                success: false,
                message: 'please fill all data'
            })
        }
        // Ensure the user exists in the database
        const existingUser = await userModel.findById(user);
        if (!existingUser) {
            return res.status(401).send({
                success: false,
                message: 'unable to find user',
            })
        }
        // Create a new blog with the correct user ID
        const newBlog = new blogModel({ title, description, image, user: existingUser._id });

        // Start a session and transaction for atomicity
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Save the new blog with the session
            await newBlog.save({ session });

            // Push the new blog ID to the user's blogs array
            existingUser.blogs.push(newBlog._id);

            // Save the updated user document with the session
            await existingUser.save({ session });

            // Commit the transaction
            await session.commitTransaction();

            // Send success response
            return res.status(201).send({
                success: true,
                message: 'new Blog created successfully',
                newBlog,
            });
        } catch (error) {
            // If an error occurs, abort the transaction
            await session.abortTransaction();
            throw error; // Rethrow the error to be caught by the outer catch block
        } finally {
            // End the session
            session.endSession();
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: 'error while creating blogs',
            error,
        });
    }
};

exports.updateBlogController = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, image, user } = req.body;
        if (!title || !description || !image) {
            return res.status(400).send({
                success: false,
                message: 'please fill all data'
            })
        }

        const blog = await blogModel.findByIdAndUpdate(id, { ...req.body }, { new: true });
        return res.status(200).send({
            success: true,
            message: 'blog updated successfully',
            blog,
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: 'error in updating blog',
            error,
        })
    }
}

exports.getSingleBlogController = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await blogModel.findById(id)
        if (!blog) {
            return res.status(401).send({
                success: false,
                message: 'blog not found'
            })
        }
        return res.status(200).send({
            success: true,
            message: 'fetch single blog ',
            blog,
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: 'error in getting single blog',
            error,
        })
    }
}

exports.deleteBlogController = async (req, res) => {
    try {
        const blog = await blogModel.findByIdAndDelete(req.params.id).populate("user");
        await blog.user.blogs.pull(blog);
        await blog.user.save();
        return res.status(200).send({
            success: true,
            message: 'blog deleted successfully ',
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: 'error while deleting blogs',
            error,
        })
    }
}

exports.userBlogController = async (req, res) => {
    try {
        const userBlog = await userModel.findById(req.params.id).populate('blogs')
        if (!userBlog) {
            return res.status(401).send({
                success: false,
                message: 'blogs not found with this id'
            })
        }
        return res.status(200).send({
            success: true,
            message: 'user blogs',
            userBlog,
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: 'error while getting user blogs',
            error,
        })
    }
}

exports.searchController = async (req, res) => {
    const { query } = req.query;

    try {
        const blogs = await blogModel.find({ title: { $regex: query, $options: 'i' } });

        res.json({ success: true, blogs });
    } catch (error) {
        console.error('Error searching blogs:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};


