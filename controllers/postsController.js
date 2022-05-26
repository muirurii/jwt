const data = require('../model/data.json');
const path = require('path');
const fsPromises = require('fs').promises;

const getPosts = (req, res) => {

    const { id, userName, userRole } = req.userInfo;

    const usersPosts = {
        posts: data.posts.filter(post => post.userId === id),
        hidden: data.hiddenPosts.filter(post => post.userId === id)
    }

    if (userRole === "ADMIN") {
        return res.json(data.posts);
    }

    if (!usersPosts.posts.length) {
        return res.json({ message: `user ${userName} has not created any posts yet` });
    }

    res.json(usersPosts);
}

const createPost = async(req, res) => {

    const { title, body } = req.body;
    const { id } = req.userInfo;

    if (!title || !body) {
        return res.sendStatus(204);
    }

    const newPost = { title, body, userId: id, postId: Math.floor(Math.random() * 200 + 3) };

    const updatedData = {...data, posts: [...data.posts, newPost] };

    await fsPromises.writeFile(path.join(__dirname, '..', 'model', 'data.json'), JSON.stringify(updatedData));

    res.status(201).json(newPost);
}

const deletePost = async(req, res) => {

    const { id } = req.userInfo;
    const { postId } = req.body;

    const usersPost = data.posts.find(post => post.userId === id && post.postId === parseInt(postId));

    if (!usersPost) {
        return res.sendStatus(204);
    }
    const updatedData = {...data, posts: data.posts.filter(post => post.postId !== parseInt(postId)) };

    await fsPromises.writeFile(path.join(__dirname, '..', 'model', 'data.json'), JSON.stringify(updatedData));

    res.json(usersPost.postId);
}

const updatePost = async(req, res) => {

    const { id } = req.userInfo;
    const { title, body, postId } = req.body;

    if (!title || !body) {
        return res.sendStatus(204);
    }

    const usersPost = data.posts.find(post => post.userId === id && post.postId === parseInt(postId));

    if (!usersPost) {
        return res.sendStatus(204);
    }

    const updatedPost = {...usersPost, title, body };

    const updatedData = {...data, posts: data.posts.map(post => post.postId === parseInt(postId) ? updatedPost : post) };

    await fsPromises.writeFile(path.join(__dirname, '..', 'model', 'data.json'), JSON.stringify(updatedData));

    res.json(updatedPost);
}

const hidePost = async(req, res) => {

    const { userRole } = req.userInfo;
    const { postId } = req.body;

    if (!postId || userRole !== "ADMIN") {
        return res.sendStatus(401);
    }

    const post = data.posts.find(post => post.postId === parseInt(postId));

    if (!post) {
        return res.sendStatus(204);
    }

    const updatedData = {...data,
        posts: data.posts.filter(post => post.postId !== parseInt(postId)),
        hiddenPosts: [...data.hiddenPosts, post]
    };

    await fsPromises.writeFile(path.join(__dirname, '..', 'model', 'data.json'), JSON.stringify(updatedData));

    res.json(post);
}

const unHidePost = async(req, res) => {

    const { userRole } = req.userInfo;
    const { postId } = req.body;

    if (!postId || userRole !== "ADMIN") {
        return res.sendStatus(401);
    }

    const post = data.hiddenPosts.find(post => post.postId === parseInt(postId));

    if (!post) {
        return res.sendStatus(204);
    }

    const updatedData = {...data,
        posts: [...data.posts, post],
        hiddenPosts: data.hiddenPosts.filter(post => post.postId !== postId)
    };

    await fsPromises.writeFile(path.join(__dirname, '..', 'model', 'data.json'), JSON.stringify(updatedData));

    res.json(post);
}

module.exports = { getPosts, createPost, deletePost, updatePost, hidePost, unHidePost };