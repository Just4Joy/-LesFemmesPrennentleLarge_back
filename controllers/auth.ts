import { Request, Response, NextFunction, RequestHandler } from 'express';
import User from '../models/user';
import IUser from '../interfaces/IUser';
import { ErrorHandler } from '../helpers/errors';
import { calculateToken, getCurrentSession } from '../helpers/auth';
import express from 'express';
import { cp } from 'fs';

const authController = express.Router();

authController.post('/', (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body as IUser;
    console.log(email, password);

    const user: IUser = await User.findByEmail(email);
    console.log(user);

    if (!user) throw new ErrorHandler(401, 'This user does not exist');
    else {
      const passwordIsCorrect: boolean = await User.verifyPassword(
        password,
        user.password
      );
      console.log(passwordIsCorrect);
      if (passwordIsCorrect) {
        const token = calculateToken(email, Number(user.id_user), user.wahine);
        console.log(token);
        res.cookie('user_token', token);
        res.json({
          id_user: user.id_user,
          firstname: user.firstname,
          wahine: user.wahine,
        });
      } else throw new ErrorHandler(401, 'Invalid Credentials');
    }
  } catch (err) {
    next(err);
  }
}) as RequestHandler);

export default authController;
