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
    const authToken = req.headers.authorization;

    if (!authToken) {
        return res.status(401).json({ error: "No authorization token provided" });
    }

    const [, token] = authToken.split(" ");

    if (!token) {
        return res.status(401).json({ error: "Invalid authorization format" });
    }

    try {
        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            return res.status(500).json({ error: "JWT secret not configured" });
        }

        const { sub } = verify(token, jwtSecret) as Payload;

        req.user_id = sub;

        return next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid token" });
    }
}