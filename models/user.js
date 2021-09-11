module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        Email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
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
        UnitNumber: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Role: {
            type: DataTypes.STRING,
            allowNull: false
        },
    })
    return User;
}