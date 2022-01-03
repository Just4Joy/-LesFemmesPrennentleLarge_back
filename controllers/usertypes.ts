import { Request, Response, NextFunction } from 'express';
import express from 'express';
import UserType from '../models/usertype';
import IUserType from '../interfaces/IUserType';

const userTypeController = express.Router();

userTypeController.get('/coucou', (req: Request, res: Response) => {
  res.status(200).send('hibou');
});

userTypeController.get(
  '/',
  (req: Request, res: Response, next: NextFunction) => {
    UserType.findAll()
      .then((usertypes: IUserType[]) => {
        res.json(usertypes);
      })
      .catch((err: Error) => {
        next(err);
      });
  }
);

export default userTypeController;
