module.exports = (sequelize, DataTypes) => {
    const Event = sequelize.define('Event', {
        EventName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        EventLocation: {
            type: DataTypes.STRING,
            allowNull: false
        },
        EventDate: {
            type: DataTypes.STRING,
            allowNull: false
        },
        EventDescription: {
            type: DataTypes.STRING,
            allowNull: false
        },
        OwnerId: {
            type: DataTypes.NUMBER,
            allowNull: false
        }
    })
    return Event;
}