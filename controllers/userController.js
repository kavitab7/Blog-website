const userModel = require('./userModel')
const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken');
const blogModel = require('./blogModel');
//register
exports.registerController = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).send({
                success: false,
                message: 'please fill all data'
            })
        }

        const existingUser = await userModel.findOne({ email })
        if (existingUser) {
            return res.status(400).send({
                success: false,
                message: 'email already exists'
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = new userModel({ username, email, password: hashedPassword })
        await user.save();
        return res.status(201).send({
            success: true,
            message: 'user created successfully',
            user,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'error in registration'
        })
    }
};

// get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({})
        return res.status(200).send({
            userCount: users.length,
            success: true,
            message: 'all users data',
            users,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'error in registration'
        })
    }
};

//login
exports.loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).send({
                success: false,
                message: 'please provide email or password'
            })
        }

        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(200).send({
                success: false,
                message: 'email is not registered'
            })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).send({
                success: false,
                message: 'invalid username or password'
            })
        }
        const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        })
        return res.status(200).send({
            success: true,
            message: 'login successfully',
            user,
            token
        })


    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'error in registration'
        })
    }
}

exports.followUser = async (req, res) => {
    const { userId, userToFollowId } = req.params;
    try {
        await userModel.findByIdAndUpdate(userToFollowId, { $addToSet: { followers: userId } });
        await userModel.findByIdAndUpdate(userId, { $addToSet: { following: userToFollowId } });
        res.json({ success: true, message: 'User followed successfully' });
    } catch (error) {
        console.error('Error following user:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

exports.unfollowUser = async (req, res) => {
    const { userId, userToFollowId } = req.params;

    try {
        await userModel.findByIdAndUpdate(userToFollowId, { $pull: { followers: userId } });
        await userModel.findByIdAndUpdate(userId, { $pull: { following: userToFollowId } });
        res.json({ success: true, message: 'User unfollowed successfully' });
    } catch (error) {
        console.error('Error unfollowing user:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

exports.checkFollowStatus = async (req, res) => {
    const { userId, userToCheckId } = req.params;
    try {
        const user = await userModel.findById(userId);
        const isFollowing = user.following.includes(userToCheckId);

        res.json({ success: true, following: isFollowing });
    } catch (error) {
        console.error('Error checking follow status:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

exports.getFollowingUsersBlogs = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const followingIds = user.following;
        const blogs = await blogModel.find({ user: { $in: followingIds } }).populate('user', 'username').sort({ createdAt: -1 });

        res.json({ success: true, blogs });
    } catch (error) {
        console.error('Error fetching following users blogs:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};