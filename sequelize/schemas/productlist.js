import { DataTypes } from 'sequelize';
import sequelize from '../config.js';
const ProductList = sequelize.define('ProductList', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    Productid: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Product',
            key: 'id_product'
        },
    },
    Factureid: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Facture',
            key: 'id_facture'
        },
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
}, { timestamps: false, });
export default ProductList;