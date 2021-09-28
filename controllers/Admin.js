const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { UniqueConstraintError } = require('sequelize/lib/errors');
const jwt = require('jsonwebtoken');
const { AdminModel } = require('../models')

/* Admin Register Endpoint */
router.post('/register', async (req, res) => {
    const { Email, Password, FirstName, LastName } = req.body.admin
    const userRole = 'Admin';
    const newAdmin = {
        Email,
        Password: bcrypt.hashSync(Password, 13),
        FirstName,
        LastName,
        Role: userRole
    }

    try {
        const Admin = await AdminModel.create(newAdmin)
        let token = await jwt.sign({ id: Admin.id, Role: userRole }, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.status(200).json({
            message: 'Admin succesfully registered',
            user: Admin,
            sessionToken: token
        });

    } catch (err) {
        if (err instanceof UniqueConstraintError) {
            res.status(500).json({
                message: "Email already in use."
            });
        } else {
            res.status(500).json({
                message: `[error]: ${err}`
            });
        }
    }
})

/* Admin Login Endpoint */
router.post('/login', async (req, res) => {
    const { Email, Password } = req.body.admin;
    const userRole = 'Admin';

    try {
        const FoundAdmin = await AdminModel.findOne({
            where: {
                Email: Email,
            }
        })

        if (FoundAdmin) {
            let verifiedAdmin = await bcrypt.compareSync(Password, FoundAdmin.Password);
            let token = await jwt.sign({ id: FoundAdmin.id, Role: userRole }, process.env.JWT_SECRET, { expiresIn: '24h' });

            if (verifiedAdmin) {
                res.status(200).json({
                    message: 'Succesfully logged in.',
                    user: FoundAdmin,
                    sessionToken: token
                });

            } else {
                res.status(400).json({
                    message: 'Login failed. Incorrect email or password'
                });
            }

        } else {
            res.status(400).json({
                message: 'Login failed. Incorrect email or password'
            });
        }

    } catch (err) {
        res.status(500).json({
            message: `[error]: ${err}`
        });
    }
});

module.exports = router