const express = require('express');
const router = express.Router();
let validate = require('../middleware/validation')
const { UserModel, AdminModel, TicketModel } = require('../models');

/* Create Ticket Endpoint */
router.post('/create', validate, async (req, res) => {
    const { TicketTitle, TicketPost } = req.body.ticket;
    const { id, Role } = req.user;
    const myTicket = {
        TicketTitle,
        TicketPost
    }

    try {
        if (Role === 'Tenant') {
            let User = await UserModel.findOne({
                where: {
                    id: id
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

        } else if (Role === 'Admin') {
            let User = await AdminModel.findOne({
                where: {
                    id: id
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
        res.status(500).json({
            message: `An error has occured, ${err}`
        });
    }
})

/* Get All Tickets by User Endpoint */
router.get('/mytickets', validate, async (req, res) => {
    const { id } = req.user;

    try {
        let User = await UserModel.findOne({
            where: {
                id: id
            }
        });

        if (User) {
            let myTickets = await TicketModel.findAll({
                where: {
                    UserId: id
                },
                include: UserModel
            });

            res.status(200).json({
                myTickets
            });

        } else {
            res.status(400).json({
                message: 'Not authorized.'
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
    const { id, Role } = req.user;

    try {
        if (Role !== 'Admin') {
            res.status(400).json({
                message: 'Not authorized.'
            });

        } else {
            let Admin = await AdminModel.findOne({
                where: {
                    id: id,
                    Role: 'Admin'
                }
            });

            if (Admin) {
                let allTickets = await TicketModel.findAll({ include: [UserModel, AdminModel] })

                res.status(200).json({
                    allTickets
                });

            } else {
                res.status(500).json({
                    message: 'Not Authorized.'
                });
            }
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
    const { TicketTitle, TicketPost, isResolved, resolving } = req.body.ticket;
    const { id, Role } = req.user;

    try {
        if (Role === 'Tenant') {
            const updatedTicket = {
                TicketTitle: TicketTitle,
                TicketPost: TicketPost
            }

            const query = {
                where: {
                    id: ticketId,
                    UserId: id
                }
            }

            await TicketModel.update(updatedTicket, query);

            res.status(200).json({
                message: "Ticket was updated by User",
                updatedTicket
            });

        } else if (Role === 'Admin') {
            const updatedTicket = {
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

            await TicketModel.update(updatedTicket, query);

            res.status(200).json({
                message: "Ticket was updated by an Admin",
                updatedTicket
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
    const ticketId = req.params.id;
    const { id, Role } = req.user;

    try {
        if (Role === 'Tenant') {
            let User = await UserModel.findOne({
                where: {
                    id: id
                }
            });

            if (User) {
                const query = {
                    where: {
                        UserId: id,
                        id: ticketId
                    }
                }

                await TicketModel.destroy(query);

                res.status(200).json({
                    message: 'Succesfully deleted ticket.'
                });
            }

        } else if (Role === 'Admin') {
            let User = await AdminModel.findOne({
                where: {
                    id: id
                }
            });

            if (User) {
                const query = {
                    where: {
                        id: ticketId
                    }
                }

                await TicketModel.destroy(query);

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

module.exports = router;