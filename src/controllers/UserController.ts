import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import ResponseFormatter from '../helpers/ResponseFormatter';
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
import { User } from '../entity/User';

export class UserController {
  static register = async (req: Request, res: Response) => {
    try {
      await body('name').isString().isLength({ max: 255 }).run(req);
      await body('username').isString().isLength({ max: 255 }).run(req);
      await body('email').isEmail().isLength({ max: 255 }).run(req);
      await body('phone').optional().isString().isLength({ max: 255 }).run(req);
      await body('password').isString().isLength({ min: 8 }).run(req);
      
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return ResponseFormatter.error(res, null, 'Validation failed', 400);
      }

      const userRepository = getRepository(User);
      const { name, username, email, phone, password } = req.body;

      const user = new User();
      user.name = name;
      user.username = username;
      user.email = email;
      user.phone = phone;
      user.password = await bcrypt.hash(password, 10);

      await userRepository.save(user);

      const token = user.createToken();

      return ResponseFormatter.success(res, {
        access_token: token,
        token_type: 'Bearer',
        user
      }, 'User Registered', 201);
    } catch (error) {
      return ResponseFormatter.error(res, error, 'Something went wrong', 500);
    }
  };

  static login = async (req: Request, res: Response) => {
    try {
      await body('email').isEmail().run(req);
      await body('password').isString().run(req);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return ResponseFormatter.error(res, null, 'Validation failed', 400);
      }

      const { email, password } = req.body;
      const userRepository = getRepository(User);
      const user = await userRepository.findOne({  where: { email } });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return ResponseFormatter.error(res, null, 'Unauthorized', 401);
      }

      const token = user.createToken();

      return ResponseFormatter.success(res, {
        access_token: token,
        token_type: 'Bearer',
        user
      }, 'Login Successful');
    } catch (error) {
      return ResponseFormatter.error(res, error, 'Something went wrong', 500);
    }
  };

  static fetch = async (req: Request, res: Response) => {
    return ResponseFormatter.success(res,(req as any).user, 'Data profile user berhasil diambil');
  };

  static updateProfile = async (req: Request, res: Response) => {
    try {
      const userRepository = getRepository(User);
      const user = await userRepository.findOne({
        // where: { id: req.user?.id }
        where: { id: (req as any).user?.id }
      });
      if (!user) {
        return ResponseFormatter.error(res, null, 'User not found', 404);
      }

      userRepository.merge(user, req.body);
      await userRepository.save(user);

      return ResponseFormatter.success(res, user, 'Profile Updated');
    } catch (error) {
      return ResponseFormatter.error(res, error, 'Something went wrong', 500);
    }
  };

  static logout = async (req: Request, res: Response) => {
    // Implement logout functionality (e.g., invalidate JWT tokens)
    return ResponseFormatter.success(res, null, 'Token Revoked');
  };
}
