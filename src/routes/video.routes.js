const express = require('express');
const router = express.Router();

const {
    getAllVideos,
    getVideoById,
    createVideo,
    updateVotes,
    updateViews
} = require('../controllers/video.controller');

router.get('/', getAllVideos);
router.get('/:videoId', getVideoById);
router.post('/', createVideo);
router.patch('/:videoId/votes', updateVotes);
router.patch('/:videoId/views', updateViews);

module.exports = router;