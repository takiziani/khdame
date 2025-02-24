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
    profit: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    capital: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    listofproducts: {
        type: DataTypes.ARRAY(DataTypes.JSON),
        allowNull: false,
        validate: {
            validProductShape(value) {
                if (!Array.isArray(value)) {
                    throw new Error("listofproducts must be an array");
                }
                value.forEach(product => {
                    if (
                        !product.hasOwnProperty("id_product") ||
                        !product.hasOwnProperty("product_name") ||
                        !product.hasOwnProperty("quantity")
                    ) {
                        throw new Error("Each product must have id_product, product_name, and quantity properties");
                    }
                });
            }
        }
    }
}, { timestamps: true, createdAt: 'created_at', updatedAt: false });
export default Facture;