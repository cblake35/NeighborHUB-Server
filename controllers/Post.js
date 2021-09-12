const express = require('express');
const router = express.Router();
let validate = require('../middleware/validation')
const { PostModel, UserModel } = require('../models')

router.post('/create', validate, async (req, res) => {
    let { Post } = req.body.feed
    const myPost = {
        Post
    }

    try {
        let myUser = await UserModel.findOne({
            where: {
                id: req.user.id
            }
        });
        
        if (myUser) {
            let newPost = await PostModel.create(myPost)
            await myUser.addPost(newPost)
            res.status(200).json(myUser)
        }
            

    } catch (err) {
        res.status(500).json({
            message: `An error occured, ${err}`
        })
    }
})

module.exports = router