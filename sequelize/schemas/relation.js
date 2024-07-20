import User from "./user.js";
import Product from "./product.js";
import Facture from "./facture.js";
// In sequelize/schemas/relation.js
User.hasMany(Product, { foreignKey: 'Userid' });
Product.belongsTo(User, { foreignKey: 'Userid' });
User.hasMany(Facture, { foreignKey: 'Userid' });
Facture.belongsTo(User, { foreignKey: 'Userid' });
export { User, Product, Facture };