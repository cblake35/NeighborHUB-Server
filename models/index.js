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
const User = DefineUser(sequelize, DataTypes);
const Admin = DefineAdmin(sequelize, DataTypes);
const Post = DefinePost(sequelize, DataTypes);
const Ticket = DefineTicket(sequelize, DataTypes);
const Event = DefineEvent(sequelize, DataTypes);


//Export models
module.exports = {
    User,
    Admin,
    Post,
    Ticket,
    Event
}