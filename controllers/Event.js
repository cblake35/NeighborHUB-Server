const express = require('express');
const router = express.Router();
const validate = require('../middleware/validation')
const { EventModel, UserModel, AdminModel } = require('../models')

/* Create Event Endpoint */
router.post('/create', validate, async (req, res) => {
    const { EventName, EventLocation, EventDate, EventDescription } = req.body.event;
    const { id, Role } = req.user
    const eventData = {
        EventName,
        EventLocation,
        EventDate,
        EventDescription
    }

    try {
        if (Role === 'Tenant') {
            let User = await UserModel.findOne({
                where: {
                    id: id
                }
            });

            if (User) {
                let myEvent = await EventModel.create(eventData);
                await User.addEvent(myEvent);

                res.status(200).json({
                    message: 'Successfully added a new event.',
                    myEvent,
                });
            }

        } else if (Role === 'Admin') {
            let User = await AdminModel.findOne({
                where: {
                    id: id
                }
            });

            if (User) {
                let myEvent = await EventModel.create(eventData);
                await User.addEvent(myEvent);

                res.status(200).json({
                    message: 'Successfully added a new event as an Admin.',
                    myEvent,
                });
            }
        }

    } catch (err) {
        res.status(500).json({
            message: `An error occured, ${err}`
        });
    }
});

/* Get Events by ID Endpoint */
router.get('/myevents', validate, async (req, res) => {
    const { id, Role } = req.user;

    try {
        if (Role === 'Tenant') {
            let User = await UserModel.findOne({
                where: {
                    id: id
                },
            });

            if (User) {
                let userEvents = await User.getEvents();

                res.status(200).json({
                    userEvents
                });
            }

        } else if (Role === 'Admin') {
            let User = await AdminModel.findOne({
                where: {
                    id: id
                },
            });

            if (User) {
                let userEvents = await User.getEvents();

                res.status(200).json({
                    userEvents
                });
            }

        } 

    } catch (err) {
        return res.status(500).json({
            message: `An error occured, ${err}`
        });
    }
});

/* Delete Event Endpoint */
router.delete('/deleteevent/:id', validate, async (req, res) => {
    const eventId = req.params.id
    const { id, Role } = req.user;

    try {
        if (Role === 'Tenant') {
            let User = await UserModel.findOne({
                where: {
                    id: id
                }
            });

            if (User) {
                query = {
                    where: {
                        UserId: id,
                        id: eventId
                    }
                }

                await EventModel.destroy(query);

                res.status(200).json({
                    message: 'The event was deleted.',
                })
            }

        } else if (Role === 'Admin') {
            let User = await AdminModel.findOne({
                where: {
                    id: id
                }
            });

            if (User) {
                query = {
                    where: {
                        AdminId: id,
                        id: eventId
                    }
                }

                await EventModel.destroy(query);

                res.status(200).json({
                    message: 'The event was deleted.',
                });
            }
        }

    } catch (err) {
        return res.status(500).json({
            message: `An error occured, ${err}`
        });
    }
})

module.exports = router;