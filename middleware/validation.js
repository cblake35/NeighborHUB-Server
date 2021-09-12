const jwt = require('jsonwebtoken');
const { UserModel, AdminModel } = require('../models')

const validate = async (req, res, next) => {
    if (req.method == 'OPTIONS') {
        next();

    } else if (req.headers.authorization && req.headers.authorization.includes('Bearer')) {
        const { authorization } = req.headers;

        const payload = authorization ? jwt.verify(authorization.includes('Bearer') ? authorization.split(" ")[1] : authorization, process.env.JWT_SECRET) : undefined;

        if (payload) {
            if (payload.Role === 'Tenant') {
                let foundUser = await UserModel.findOne({
                    where: {
                        id: payload.id
                    }
                });

                if (foundUser) {
                    req.user = foundUser;
                    next();

                } else {
                    res.status(400).json({
                        message: 'Not Authorized.',
                    });
                }

            } else if (payload.Role === 'Admin') {
                let foundUser = await AdminModel.findOne({
                    where: {
                        id: payload.id
                    }
                });

                if (foundUser) {
                    req.user = foundUser;
                    next();

                } else {
                    res.status(400).json({
                        message: 'Not Authorized.',
                    });
                }
                
            } else {
                res.status(400).json({
                    message: 'Not Authorized.',
                    mypayload: payload
                });
            }

        } else {
            res.status(400).json({
                message: 'Invalid Token.'
            });
        }

    } else {
        res.status(400).json({
            message: 'Not Authorized.',
        });
    }
}

module.exports = validate;