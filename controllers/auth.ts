import { Request, Response, NextFunction, RequestHandler } from 'express';
import User from '../models/user';
import IUser from '../interfaces/IUser';
import { ErrorHandler } from '../helpers/errors';
import { calculateToken } from '../helpers/auth';
import express from 'express';

const authController = express.Router();

authController.post('/', (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body as IUser;
    const user: IUser = await User.findByEmail(email);
    if (!user) throw new ErrorHandler(401, 'This user does not exist');
    else {
      const passwordIsCorrect: boolean = await User.verifyPassword(
        password,
        user.password
      );
      if (passwordIsCorrect) {
        const token = calculateToken(email, Number(user.id_user), user.admin);
        res.cookie('user_token', token);
        res.send();
      } else throw new ErrorHandler(401, 'Invalid Credentials');
    }
  } catch (err) {
    next(err);
  }
}) as RequestHandler);

export default authController;
