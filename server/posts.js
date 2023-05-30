const { Model, DataTypes } = require('sequelize');

const sequelize = require ('./database');
const User = require('./user');

  

  class Post extends Model {}
  Post.init({
    Name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    userId: {
      type: DataTypes.INTEGER,  
      allowNull:true,
      references:{
        model:User,
        key:'id',
      },
    }, 
  },{
    sequelize,
    modelName:'post',
    timestamps:true,
  });
  
  Post.belongsTo(User);
  User.hasMany(Post);

  


module.exports = Post;
