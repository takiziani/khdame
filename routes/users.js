import { Router } from "express";
import { User } from "../sequelize/schemas/relation.js";
import { hashPassword, comparePassword } from "../utils/helper.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import verifyjwt from "../utils/jwt.js";
import { Op } from 'sequelize';
dotenv.config();
const router = Router();
router.post("/users/register", async (request, response) => {
    try {
        const user = request.body;
        user.password = hashPassword(user.password);
        console.log(user);
        const newuser = await User.create(user);
        response.json({ message: "User created" });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});
router.delete("/users/delete", verifyjwt, async (request, response) => {
    try {
        const id = request.userid;
        await User.destroy({ where: { id_user: id } });
        response.json({ message: `User with id ${id} has been deleted` });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});
router.post("/users/login", async (request, response) => {
    try {
        const { login, password } = request.body;
        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { email: login },
                    { username: login }
                ]
            }
        });
        console.log(user);
        if (!user) {
            return response.status(404).json({ error: "User not found" });
        }
        const hash = hashPassword(password);
        const isPasswordValid = comparePassword(password, user.password);
        if (!isPasswordValid) {
            return response.status(400).json({ error: "Invalid password" });
        }

        const accessToken = jwt.sign({ "id": user.id_user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
        const refreshToken = jwt.sign({ "id": user.id_user }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
        user.refresh_token = refreshToken;
        await user.save();
        response.cookie('refreshToken', refreshToken, {
            httpOnly: true, // The cookie is not accessible via JavaScript
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production (over HTTPS)
            sameSite: 'None', // Strictly same site
            maxAge: 7 * 24 * 60 * 60 * 1000,// Cookie expiry set to match refreshToken,
        });
        // Send the access token to the client
        response.json({
            user: user.username,
            accessToken
        });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});
router.get("/users/refresh", async (request, response) => {
    try {
        const refreshToken = request.cookies.refreshToken;
        if (!refreshToken) {
            return response.status(401).json({ error: "Refresh token not found" });
        }
        let payload;
        payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findOne({ where: { id_user: payload.id } });
        if (!user || user.refresh_token !== refreshToken) {
            return response.status(401).json({ error: "Invalid refresh token" });
        }
        const accessToken = jwt.sign({ username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
        response.json({ accessToken });
    } catch (error) {
        return response.status(401).json({ error: error.message });
    }
});
router.get("/users/check", verifyjwt, async (request, response) => {
    const userid = request.userid;
    const user = await User.findOne({ where: { id_user: userid } });
    response.json({ userinfo: user, message: "User is logged in" });
});
router.post("/users/logout", verifyjwt, async (request, response) => {
    try {
        const cookies = request.cookies;
        const user = await User.findOne({ where: { refresh_token: cookies.refreshToken } });
        if (!user) {
            return response.status(401).json({ error: "User not found" });
        }
        user.refreshToken = null;
        await user.save();
        response.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        response.json({ message: "Logged out" });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});
router.patch("/users/update", verifyjwt, async (request, response) => {
    try {
        const id = request.userid;
        const user = request.body;
        const userprevious = await User.findOne({ where: { id_user: id } });
        if (userprevious) {
            if (user.email) {
                userprevious.email = user.email;
            }
            if (user.username) {
                userprevious.username
            }
            if (user.storename) {
                userprevious.storename = user.store
            }
        }
        await userprevious.save();
        response.json({ message: "User updated", user: userprevious });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});
export default router;