const { Sequelize } = require('sequelize')

// const sequelize = new Sequelize(process.env.DB_DBNAME, process.env.DB_USER, `${encodeURIComponent(process.env.DB_PASS)}`, {
//     host: process.env.DB_HOST,
//     dialect: 'postgres'
// })


const sequelize = new Sequelize(process.env.DATABASE_URL, process.env.HOST != 'localhost' ? {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
}
    :
    {
        dialect: 'postgres',
        define: {
            timestamps: false
        }
    }
)





module.exports = {
    sequelize,
}
