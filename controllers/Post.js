const express = require('express');
const router = express.Router();
let validate = require('../middleware/validation')
const { PostModel, UserModel, AdminModel } = require('../models')

/* Create Post Endpoint */
router.post('/create', validate, async (req, res) => {
    const { Post } = req.body.feed;
    const { id, Role } = req.user;

    try {
        if (Role === 'Tenant') {
            let myUser = await UserModel.findOne({
                where: {
                    id: id
                }
            });

            if (myUser) {
                let newPost = await PostModel.create({ Post });
                await myUser.addPost(newPost);

                res.status(200).json({ newPost });
            }

        } else if (Role === 'Admin') {
            let myUser = await AdminModel.findOne({
                where: {
                    id: id
                }
            });

            if (myUser) {
                let newPost = await PostModel.create({ Post });
                await myUser.addPost(newPost);

                res.status(200).json({ newPost });
            }
        }

    } catch (err) {
        res.status(500).json({
            message: `An error occured, ${err}`
        });
    }
})

/* Get All Posts Endpoint */
router.get('/allposts', validate, async (req, res) => {

    try {
        let AllPosts = await PostModel.findAll();
        res.status(200).json({ AllPosts });

    } catch (err) {
        res.status(500).json({
            message: `An error occured, ${err}`
        });
    }
});

/* Updates Posts Endpoint */
router.put('/:id', validate, async (req, res) => {
    const postId = req.params.id;
    const { Post } = req.body.feed
    const { id, Role } = req.user

    try {
        if (Role === 'Tenant') {
            const updatePost = {
                Post: Post
            }

            const query = {
                where: {
                    id: postId,
                    UserId: id
                }
            }

            await PostModel.update(updatePost, query);

            res.status(200).json({
                message: "Post was updated by User",
                updatePost
            });

        } else if (Role === 'Admin') {
            const updatePost = {
                Post: Post
            }

            const query = {
                where: {
                    id: postId,
                }
            }

            await PostModel.update(updatePost, query);

            res.status(200).json({
                message: "Post was updated by Admin",
                updatePost
            });
        }

    } catch (err) {
        res.status(500).json({
            message: `An error occured, ${err}`
        });
    }
});

/* Delete Posts Endpoint */
router.delete('/deletepost/:id', validate, async (req, res) => {
    const postid = req.params.id;
    const { id, Role } = req.user;

    try {
        if (Role === 'Tenant') {
            let myUser = await UserModel.findOne({
                where: {
                    id: id
                }
            });

            if (myUser) {
                const query = {
                    where: {
                        id: postid,
                        UserId: id
                    }
                }

                await PostModel.destroy(query);

                res.status(200).json({
                    message: 'Successfully deleted post as a User'
                });
            }

        } else if (Role === 'Admin') {
            let myUser = await AdminModel.findOne({
                where: {
                    id: id
                }
            });

            if (myUser) {
                const query = {
                    where: {
                        id: postid
                    }
                }

                await PostModel.destroy(query);

                res.status(200).json({
                    message: 'Successfully deleted post as an Admin.'
                });
            }
        }

    } catch (err) {
        res.status(500).json({
            message: `An error occured, ${err}`
        });
    }
});

module.exports = router;