require('dotenv').config()
const express = require('express')
const app = express()
const { sequelize } = require('./db')

app.use(require('./middleware/headers'))
const controllers = require('./controllers')

app.use(express.json())

app.use('/user', controllers.UserController)
app.use('/admin', controllers.AdminController)
app.use('/post', controllers.PostController)
app.use('/ticket', controllers.TicketController)
app.use('/event', controllers.EventController)


sequelize.authenticate()
    .then(() => {
        sequelize.sync()
        console.log(`Database: DB models were synchronized.`)
    })
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`[Server]: Server is running.`)
        })
    })
    .catch((err) => {
        console.log(`[Server]: Server crashed, ${err}.`)
    });