import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

interface Payload {
    sub: string;
}

export function isAuthenticated(
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.log("=== isAuthenticated (Production Debug) ===");
    console.log("Request URL:", req.url);
    console.log("Request method:", req.method);
    console.log("Environment:", process.env.NODE_ENV);
    console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);
    
    const authToken = req.headers.authorization;

    if (!authToken) {
        console.log("No authorization token provided");
        return res.status(401).json({ error: "No authorization token provided" });
    }

    const [, token] = authToken.split(" ");

    if (!token) {
        console.log("Invalid authorization format");
        return res.status(401).json({ error: "Invalid authorization format" });
    }

    try {
        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            console.log("JWT secret not configured");
            return res.status(500).json({ error: "JWT secret not configured" });
        }

        const { sub } = verify(token, jwtSecret) as Payload;
        console.log("Token verified successfully, user_id:", sub);

        req.user_id = sub;

        return next();
    } catch (err) {
        console.log("Token verification failed:", err);
        return res.status(401).json({ error: "Invalid token" });
    }
}