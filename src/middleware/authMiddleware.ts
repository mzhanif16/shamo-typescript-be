import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { User } from '../entity/User';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
        jwt.verify(token, '155155', async (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Invalid token' });
            }

            try {
                const userRepository = getRepository(User);
                const user = await userRepository.findOne({ where: { id: (decoded as any).id } });

                if (user) {
                    // req.user = user;
                    (req as any).user = user
                    next();
                } else {
                    res.status(401).json({ message: 'User not found' });
                }
            } catch (error) {
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    } else {
        res.status(401).json({ message: 'No token provided' });
    }
};
