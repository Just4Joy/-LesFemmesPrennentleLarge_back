import { Request, Response, NextFunction, RequestHandler } from 'express';
import User from '../models/user';
import IUser from '../interfaces/IUser';
import { ErrorHandler } from '../helpers/errors';
import { calculateToken } from '../helpers/auth';
import express from 'express';
import Imagekit from 'imagekit';

const authController = express.Router();

authController.post(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
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
          const token = calculateToken(
            email,
            Number(user.id_user),
            Number(user.wahine),
            Number(user.admin)
          );
          console.log(token);
          res.cookie('user_token', token);
          res.json({
            id_user: user.id_user,
            firstname: user.firstname,
            wahine: user.wahine,
            admin: user.admin,
            token: token,
          });
        } else throw new ErrorHandler(401, 'Invalid Credentials');
      }
    } catch (err) {
      next(err);
    }
  }
);

authController.get('/', (req: Request, res: Response) => {
  const imagekit = new Imagekit({
    publicKey: String(process.env.publicAPIKEY),
    privateKey: String(process.env.privateAPIKey),
    urlEndpoint: 'https://ik.imagekit.io/LFPLL/',
  });

  const authenticationParameters = imagekit.getAuthenticationParameters();
  res.status(200).json(authenticationParameters);
});

export default authController;
