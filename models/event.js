module.exports = (sequelize, DataTypes) => {
    const Event = sequelize.define('Event', {
        EventName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        EventPoster: {
            type: DataTypes.STRING,
            allowNull: false
        },
        EventDate: {
            type: DataTypes.STRING,
            allowNull: false
        },
        EventTime: {
            type: DataTypes.STRING,
            allowNull: false
        },
        EventUrl: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })
    return Event;
}