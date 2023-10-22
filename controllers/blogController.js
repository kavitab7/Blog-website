const mongoose = require('mongoose')
const blogModel = require('./blogModel')
const userModel = require('./userModel')

exports.getAllBlogsController = async (req, res) => {
    try {
        const blogs = await blogModel.find({}).populate('user')
        if (!blogs) {
            return res.status(200).send({
                success: false,
                message: 'no blogs found',
            })
        }
        return res.status(200).send({
            BlogCount: blogs.length,
            success: true,
            message: 'all blogs ',
            blogs,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'error in getting all blogs',
            error,
        })
    }
}
exports.createBlogController = async (req, res) => {
    try {
        const { title, description, image, user } = req.body;
        if (!title || !description || !image || !user) {
            return res.status(400).send({
                success: false,
                message: 'please fill all data'
            })
        }
        const existingUser = await userModel.findById(user);
        if (!existingUser) {
            return res.status(401).send({
                success: false,
                message: 'unable to find user',
            })
        }
        const newBlog = new blogModel({ title, description, image, user });
        const session = await mongoose.startSession();
        session.startTransaction();
        await newBlog.save({ session });
        existingUser.blogs.push(newBlog);
        await existingUser.save({ session });
        await session.commitTransaction();
        await newBlog.save();
        return res.status(201).send({
            success: true,
            message: 'new Blog created successfully',
            newBlog,
        })

    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: 'error while creating blogs',
            error,
        })
    }
}


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