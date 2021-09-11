const { Sequelize } = require('sequelize/types')

const sequelize = new Sequelize(process.env.DB_DBNAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'postgres'
})

module.exports= {
    sequelize,
}
