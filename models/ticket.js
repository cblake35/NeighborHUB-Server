module.exports = (sequelize, DataTypes) => {
    const Ticket = sequelize.define('Ticket', {
        TicketTitle: {
            type: DataTypes.STRING,
            allowNull: false
        },
        TicketPost: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    })
    return Ticket;
}