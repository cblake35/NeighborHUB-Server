module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post', {
        Post: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    })
    return Post;
}