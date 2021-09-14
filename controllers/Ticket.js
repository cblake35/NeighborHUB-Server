const express = require('express');
const router = express.Router();
let validate = require('../middleware/validation')
const { UserModel, AdminModel, TicketModel } = require('../models');

/* Create Ticket Endpoint */
router.post('/create', validate, async (req, res) => {
    const { TicketTitle, TicketPost } = req.body.ticket
    const myTicket = {
        TicketTitle,
        TicketPost
    }

    try {
        if (req.user.Role === 'Tenant') {
            let User = await UserModel.findOne({
                where: {
                    id: req.user.id
                }
            });

            if (User) {
                let newTicket = await TicketModel.create(myTicket);
                await User.addTicket(newTicket);
                res.status(200).json({
                    message: "Ticket successfully created.",
                    newTicket
                });
            }

        } else if (req.user.Role === 'Admin') {
            let User = await AdminModel.findOne({
                where: {
                    id: req.user.id
                }
            });

            if (User) {
                let newTicket = await TicketModel.create(myTicket);
                await User.addTicket(newTicket);
                res.status(200).json({
                    message: "Ticket successfully created by an Admin.",
                    newTicket
                });
            }
        }

    } catch (err) {

    }
})

/* Get All Tickets by User Endpoint */
router.get('/:id', validate, async (req, res) => {
    const userId = req.params.id;

    try {
        let User = await UserModel.findOne({
            where: {
                id: userId
            }
        });

        if (User) {
            let myTickets = await TicketModel.findAll({
                where: {
                    UserId: userId
                },
                include: UserModel
            });
            res.status(200).json({
                myTickets
            });
        }

    } catch (err) {
        res.status(500).json({
            message: `An error has occured, ${err}`
        });
    }
});

/* Get All Tickets(Admin) */
router.get('/admin/alltickets', validate, async (req, res) => {

    try {
        let Admin = await AdminModel.findOne({
            id: req.user.id,
            Role: 'Admin'
        })

        if (Admin) {
            let allTickets = await TicketModel.findAll({ include: UserModel })
            await Admin.getTickets(allTickets);
            res.status(200).json({
                allTickets
            })
        } else {
            res.status(500).json({
                message: 'Not Authorized.'
            })
        }
    } catch (err) {
        res.status(500).json({
            message: `An error has occured, ${err}`
        });
    }
});

/* Update Ticket Endpoint */
router.put('/updateticket/:id', validate, async (req, res) => {
    const ticketId = req.params.id;
    const { TicketTitle, TicketPost, isResolved, resolving } = req.body.ticket
    const { id, Role } = req.user

    try {
        if (Role === 'Tenant') {
            const updateTicket = {
                TicketTitle: TicketTitle,
                TicketPost: TicketPost
            }

            const query = {
                where: {
                    id: ticketId,
                    UserId: id
                }
            }

            await TicketModel.update(updateTicket, query);
            res.status(200).json({
                message: "Ticket was updated by User",
                updateTicket
            });


        } else if (Role === 'Admin') {
            const updateTicket = {
                TicketTitle: TicketTitle,
                TicketPost: TicketPost,
                isResolved: isResolved,
                resolving: resolving
            }

            const query = {
                where: {
                    id: ticketId,
                }
            }

            await TicketModel.update(updateTicket, query);
            res.status(200).json({
                message: "Ticket was updated by Admin",
                updateTicket
            });
        }

    } catch (err) {
        res.status(500).json({
            message: `An error occured, ${err}`
        });
    }
});

/* Delete Ticket Endpoint */
router.delete('/deleteticket/:id', validate, async (req, res) => {
    const ticketId = req.params.id

    try {
        if (req.user.Role === 'Tenant') {
            let User = await UserModel.findOne({
                where: {
                    id: req.user.id
                }
            });

            if (User) {
                const query = {
                    where: {
                        UserId: req.user.id,
                        id: ticketId
                    }
                }

                let deletedTicket = await TicketModel.destroy(query);
                await User.removeTicket(deletedTicket);
                res.status(200).json({
                    message: 'Succesfully deleted ticket.'
                });
            }

        } else if (req.user.Role === 'Admin') {
            let User = await AdminModel.findOne({
                where: {
                    id: req.user.id
                }
            });

            if (User) {
                const query = {
                    where: {
                        id: ticketId
                    }
                }

                let deletedTicket = await TicketModel.destroy(query);
                await User.removeTicket(deletedTicket);
                res.status(200).json({
                    message: 'Admin succesfully deleted ticket.'
                });
            }
        }

    } catch (err) {
        res.status(500).json({
            message: `An error occured, ${err}`
        });
    }

});

module.exports = router