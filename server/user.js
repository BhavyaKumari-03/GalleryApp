const { Model, DataTypes } = require ('sequelize')
const sequelize = require ('./database');



class User extends Model {}
User.init({
    f_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    l_name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
},{
    sequelize,
    modelName:'user',
    timestamps:false
})
sequelize.sync().then(()=> console.log('database is ready'));
module.exports = User;