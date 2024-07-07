const express = require('express');
const router = express.Router();
const url = require('url');
const axios = require('axios');

const { createUser, getUser, updateUser, discordJoin, verifyTweet,authorizeTweet } = require('../controller/userController');

// Create a new user
router.post('/create', createUser);

// Get user info
router.get('/:owner', getUser);

router.put('/update/:owner', updateUser);


router.get('/auth/discord/redirect', discordJoin);
router.put('/get/tweet/:tweetId', verifyTweet);
router.put('/callback',authorizeTweet );
module.exports = router;