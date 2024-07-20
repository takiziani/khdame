import { Router } from "express";
import { User } from "../sequelize/schemas/relation.js";
import { hashPassword, comparePassword } from "../utils/helper.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import verifyjwt from "../utils/jwt.js";
dotenv.config();
const router = Router();
router.post("/users/register", async (request, response) => {
    const user = request.body;
    user.password = await hashPassword(user.password);
    console.log(user);
    try {
        const newuser = await User.create(user);
        response.json(newuser);
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});
router.delete("/users/delete", verifyjwt, async (request, response) => {
    const id = request.user.id;
    try {
        await User.destroy({ where: { id_user: id } });
        response.json({ message: `User with id ${id} has been deleted` });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});
router.post("/users/login", async (request, response) => {
    const { login, password } = request.body;
    const user = await User.findOne({ $or: [{ email: login }, { username: login }] }); // find user by email or username
    if (!user) {
        return response.status(404).json({ error: "User not found" });
    }
    const isPasswordValid = await comparePassword(password, user.password);
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
        maxAge: 7 * 24 * 60 * 60 * 1000 // Cookie expiry set to match refreshToken
    });

    // Send the access token to the client
    response.json({
        accessToken,
        message: "Login successful"
    });
});
router.get("/users/refresh", async (request, response) => {
    const refreshToken = request.cookies.refreshToken;
    if (!refreshToken) {
        return response.status(401).json({ error: "Refresh token not found" });
    }
    let payload;
    try {
        payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
        return response.status(401).json({ error: "Invalid refresh token" });
    }
    const user = await User.findOne({ where: { username: payload.username } });
    if (!user || user.refresh_token !== refreshToken) {
        return response.status(401).json({ error: "Invalid refresh token" });
    }
    const accessToken = jwt.sign({ username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
    response.json({ accessToken });
});
router.get("/users/check", verifyjwt, async (request, response) => {
    response.json({ message: "User is logged in" });
});
router.post("/users/logout", verifyjwt, async (request, response) => {
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
});
router.patch("/users/update", verifyjwt, async (request, response) => {
    const id = request.user.id;
    const user = request.body;
    const userprevious = await User.findOne({ where: { id_user: id } });
    try {
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
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});
export default router;