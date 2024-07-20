import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const verifyjwt = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'No token provided' });
    }
    console.log(authHeader);
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token, process.env.ACCESS_TOKEN_SECRET,
        (error, decoded) => {
            if (error) return res.status(403).json({ error: 'Invalid token' });
            req.userid = decoded.id;
            next();
        });
};
export default verifyjwt;