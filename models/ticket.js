module.exports = (sequelize, DataTypes) => {
    const Ticket = sequelize.define('Ticket', {
        TicketTitle: {
            type: DataTypes.STRING,
            allowNull: false
        },
        TicketPost: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        isResolved: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        resolving: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        }
    })
    return Ticket;
}