import { DataTypes } from 'sequelize';
import sequelize from '../config.js';
const Facture = sequelize.define('Facture', {
    id_facture: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    total: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    profit: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    capital: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    listofproducts: {
        type: DataTypes.JSON,
        allowNull: false,
    }
}, { timestamps: false, });
export default Facture;