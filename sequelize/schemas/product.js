import { DataTypes } from 'sequelize';
import sequelize from '../config.js';
const Product = sequelize.define('Product', {
    id_product: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    barcode: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: null,
        unique: true,
    },
    price_sell: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    price_bought: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: false,
    indexes: [{
        fields: ['barcode'],
    },],
});
export default Product;