import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();
let sequelize;
if (process.env.DATABASE_URL !== "") {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false // This line will fix potential certificate issues
            }
        }
    });
} else {
    sequelize = new Sequelize({
        dialect: "mysql", // Replace with your database dialect
        host: "localhost", // Replace with your database host
        port: "3306", // Replace with your database port
        username: "root", // Replace with your database username
        password: "2003", // Replace with your database password
        database: "khadame", // Replace with your database name
    });
}
export default sequelize;