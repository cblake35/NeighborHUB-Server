//Grab DB instance
const { sequelize } = require('../db');
const { DataTypes } = require('sequelize');

//Grab model functions
const DefineUser = require('./user');
const DefineAdmin = require('./admin');
const DefinePost = require('./post');
const DefineTicket = require('./ticket');
const DefineEvent = require('./event');

//Define models and pass sequelize and DataTypes as arguments
const UserModel = DefineUser(sequelize, DataTypes);
const AdminModel = DefineAdmin(sequelize, DataTypes);
const PostModel = DefinePost(sequelize, DataTypes);
const TicketModel = DefineTicket(sequelize, DataTypes);
const EventModel = DefineEvent(sequelize, DataTypes);

UserModel.hasMany(PostModel);
PostModel.belongsTo(UserModel);

//Export models
module.exports = {
    UserModel,
    AdminModel,
    PostModel,
    TicketModel,
    EventModel
}