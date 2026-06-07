import { Request, Response } from "express";
import { generateToken } from "../middlewares/csrf.middleware";
import { prisma } from '../lib/prisma';
import argon2 from 'argon2';
import { setTokenCookie } from "../utils/auth.util";

export const getCsrfToken = (req: Request, res: Response) => {
    const token = generateToken(req, res);
    res.json({ csrfToken: token });
}

export const register = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    // Enforce strong password
    if (password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' });
        }

        const passwordHash = await argon2.hash(password);
        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
            },
        });

        setTokenCookie(res, user.id);
        res.status(201).json({ id: user.id, email: user.email });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.passwordHash) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isValid = await argon2.verify(user.passwordHash, password);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        setTokenCookie(res, user.id);
        res.json({ id: user.id, email: user.email });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const googleCallback = (req: Request, res: Response) => {
    const user = req.user as any;
    if (user && user.id) {
        setTokenCookie(res, user.id);
        // Redirect to frontend dashboard
        res.redirect(process.env.FRONTEND_URL || 'http://localhost:3000');
    } else {
        res.redirect(process.env.FRONTEND_URL ? `${process.env.FRONTEND_URL}/login` : 'http://localhost:3000/login');
    }
}

export const logout = (req: Request, res: Response) => {
    res.clearCookie('__Secure-token');
    res.json({ message: 'Logged out' });
}

export const me = (req: Request, res: Response) => {
    const user = (req as any).user;
    res.json({
        id: user.id,
        email: user.email,
    });
}