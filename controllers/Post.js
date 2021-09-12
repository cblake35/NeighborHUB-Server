const express = require('express');
const router = express.Router();
let validate = require('../middleware/validation')
const { PostModel, UserModel, AdminModel } = require('../models')

/* Create Post Endpoint */
router.post('/create', validate, async (req, res) => {
    let { Post } = req.body.feed

    try {
        if (req.user.Role === 'Tenant') {
            let myUser = await UserModel.findOne({
                where: {
                    id: req.user.id
                }
            });

            if (myUser) {
                let newPost = await PostModel.create({ Post });
                await myUser.addPost(newPost);
                res.status(200).json({ Post });
            }

        } else if (req.user.Role === 'Admin') {
            let myUser = await AdminModel.findOne({
                where: {
                    id: req.user.id
                }
            });

            if (myUser) {
                let newPost = await PostModel.create({ Post });
                await myUser.addPost(newPost);
                res.status(200).json({ Post });
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
        })
    }
})

/* Updates Posts Endpoint */
router.put('/:id', validate, async (req, res) => {
    let postId = req.params.id;
    let { Post } = req.body.feed
    let { id, Role } = req.user

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
                message: "Post was updated by User"
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
                message: "Post was updated by Admin"
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
    let postid = req.params.id;
    let { id, Role } = req.user;

    try {
        if (Role === 'Tenant') {
            const query = {
                where: {
                    id: postid,
                    UserId: id
                }
            }

            let myUser = await UserModel.findOne({ where: { id: id } });
            let myDeletedPost = await PostModel.destroy(query);

            myUser.removePost(myDeletedPost);
            res.status(200).json({
                message: 'Successfully deleted post as a User'
            });

        } else if (Role === 'Admin') {
            const query = {
                where: {
                    id: postid,
                }
            }

            let myUser = await AdminModel.findOne({ where: { id: id } });
            let myDeletedPost = await PostModel.destroy(query);

            myUser.removePost(myDeletedPost);
            res.status(200).json({
                message: 'Successfully deleted post as an Admin'
            });
        }

    } catch (err) {
        res.status(500).json({
            message: `An error occured, ${err}`
        });
    }
});

module.exports = router;