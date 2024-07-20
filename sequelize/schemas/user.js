import { DataTypes } from 'sequelize';
import sequelize from '../config.js';

const User = sequelize.define('User', {
    id_user: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING, // Changed to DataTypes.STRING
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    username: {
        type: DataTypes.STRING, // Changed to DataTypes.STRING
        allowNull: false,
        unique: true,
    },
    storename: {
        type: DataTypes.STRING, // Changed to DataTypes.STRING
        allowNull: true,
    },
    password: {
        type: DataTypes.STRING, // Changed to DataTypes.STRING
        allowNull: false,
    },
    refresh_token: {
        type: DataTypes.TEXT, // Changed to DataTypes.STRING
        allowNull: true,
    }
},
    {
        timestamps: false,
    }
);

export default User;