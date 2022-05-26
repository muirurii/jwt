const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');

router.route('/')
    .get(postsController.getPosts)
    .post(postsController.createPost)
    .put(postsController.updatePost)
    .delete(postsController.deletePost);

router.route('/hide')
    .post(postsController.hidePost);

module.exports = router;