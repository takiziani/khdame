import { Sequelize } from "sequelize";
const sequelize = new Sequelize({
    dialect: "mysql", // Replace with your database dialect
    host: "localhost", // Replace with your database host
    port: "3306", // Replace with your database port
    username: "root", // Replace with your database username
    password: "2003", // Replace with your database password
    database: "khadame", // Replace with your database name
});
export default sequelize;