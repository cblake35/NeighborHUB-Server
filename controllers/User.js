const express = require('express');
const router = express.Router();
const { UserModel } = require('../models')

router.post('/register', async (req, res) => {
    let { Email, Password, FirstName, LastName, UnitNumber} = req.body.user
    let userRole = 'Tenant';
    const newUser = {
        Email,
        Password,
        FirstName,
        LastName,
        UnitNumber,
        Role: userRole
    }
    try {
        const User = await UserModel.create(newUser)
        res.status(200).json({
            message: 'User succesfully registered',
            user: User
        })
    } catch (err) {
        res.status(500).json({
            message: `[error]: ${err}`
        })
    }

})



module.exports = router