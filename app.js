require('dotenv').config()
const express = require('express')
const app = express()
const { sequelize } = require('./db')

app.use(express.json())


sequelize.authenticate()
    .then(() => {
        sequelize.sync({ alter: true })
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