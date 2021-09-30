const { Sequelize } = require('sequelize')

// const sequelize = new Sequelize(process.env.DB_DBNAME, process.env.DB_USER, `${encodeURIComponent(process.env.DB_PASS)}`, {
//     host: process.env.DB_HOST,
//     dialect: 'postgres'
// })


const sequelize = new Sequelize(process.env,DATABASE_URL, {
    dialect: 'postgres'
})





module.exports = {
    sequelize,
}
