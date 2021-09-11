module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post', {
        Post: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        OwnerId: {
            type: DataTypes.NUMBER,
            allowNull: false
        }
    })
    return Post;
}