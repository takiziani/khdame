import allowedOrigins from "./allowedorigins.js";
export const credentials = (req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.indexOf(origin) !== -1) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Credentials', true);
    next();
}
