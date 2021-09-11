module.exports = (sequelize, DataTypes) => {
    const Admin = sequelize.define('Admin', {
        Email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        FirstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        LastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Role: {
            type: DataTypes.STRING,
            allowNull: false
        },
    })
    return Admin;
}