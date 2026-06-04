import { Response } from "express";
import { getJwtSecret } from "../middlewares/auth.middleware";
import jwt from 'jsonwebtoken';

export const setTokenCookie = (res: Response, userId: number) => {
    const token = jwt.sign({ userId }, getJwtSecret(), {
        expiresIn: '7d',
        algorithm: 'HS256',
    });

    res.cookie('__Secure-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};
