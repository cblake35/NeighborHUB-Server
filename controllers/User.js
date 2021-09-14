const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { UniqueConstraintError } = require('sequelize/lib/errors');
const jwt = require('jsonwebtoken');
const { UserModel } = require('../models');

/* User Register Endpoint */
router.post('/register', async (req, res) => {
    const { Email, Password, FirstName, LastName, UnitNumber } = req.body.user
    const userRole = 'Tenant';
    const newUser = {
        Email,
        Password: bcrypt.hashSync(Password, 13),
        FirstName,
        LastName,
        UnitNumber,
        Role: userRole
    }

    try {
        const User = await UserModel.create(newUser)
        let token = await jwt.sign({id: User.id, Role: userRole}, process.env.JWT_SECRET, {expiresIn: '24h'});

        res.status(200).json({
            message: 'User succesfully registered',
            user: User,
            sessionToken: token
        });

    } catch (err) {
        if (err instanceof UniqueConstraintError) {
            res.status(500).json({
                message: "Email already in use."
            })
        } else {
            res.status(500).json({
                message: `[error]: ${err}`
            })
        }
    }
})

/* User Login Endpoint */
router.post('/login', async (req, res) => {
    const { Email, Password } = req.body.user;
    const userRole = 'Tenant';

    try {
        const FoundUser = await UserModel.findOne({
            where: {
                Email: Email,
            }
        })

        if (FoundUser) {
            let verifiedUser = await bcrypt.compareSync(Password, FoundUser.Password);
            let token = await jwt.sign({id: FoundUser.id, Role: userRole}, process.env.JWT_SECRET, {expiresIn: '24h'});

            if (verifiedUser) {
                res.status(200).json({
                    message: 'Succesfully logged in.',
                    user: FoundUser,
                    sessionToken: token
                });

            } else {
                res.status(400).json({
                    message: 'Login failed. Incorrect email or password'
                })
            }

        } else {
            res.status(400).json({
                message: 'Login failed. Incorrect email or password'
            })
        }

    } catch (err) {
        res.status(500).json({
            message: `[error]: ${err}`
        })
    }
})

module.exports = router