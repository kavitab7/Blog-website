const express = require('express');
const { getAllUsers, loginController, registerController } = require('../controllers/userController');

const router = express.Router();

//get users
router.get('/all-users', getAllUsers)

//create user
router.post('/register', registerController)

//login user
router.post('/login', loginController)

module.exports = router;