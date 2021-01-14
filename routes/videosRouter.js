const express = require('express');

const router = express.Router();

const videoController = require('../controllers/videoController');

router.route('/').get(videoController.getVideos);

module.exports = router;
