const express = require('express');
const router = express.Router();
const Signup = require('./handler/user/sign.up');
const Login = require('./handler/user/login');
router.post('/signup', Signup);
router.post('/login', Login);
module.exports = router;