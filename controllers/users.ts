import express from 'express';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import User from '../models/user';
import Schema from '../_utils/validator';
import IUser from '../interfaces/IUser';

const userController = express.Router();

userController.get('/', (async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result: IUser[] = await User.findMany();
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}) as RequestHandler);


userController.get('/:id', (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params as IUser
  try {
    const result: IUser = await User.findOneById(id);
    console.log(result)
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}) as RequestHandler);

userController.post('/', User.validateUser, (async (req: Request, res: Response) => {
  const validation = Schema.validate(req.body);
  if (validation.error) {
    return res.status(422).json(validation.error.message);
  }
  const { email } = req.body as IUser;
  const existingEmail: IUser = await User.findByEmail(email);
  if (existingEmail) {
    return res.status(400).json('BAD REQUEST EMAIL ALREADY EXIST');
  }
  const user = req.body as IUser;
  const response = await User.create(user);
  return res.status(200).json({ id_user: response[0].insertId, ...req.body });
}) as RequestHandler);

userController.put('/:idUser', (async (req: Request, res: Response) => {
  try {
    const { idUser } = req.params;
    const foundUser: IUser = await User.findOneById(parseInt(idUser, 10));
    console.log(foundUser);
    if (foundUser[0]) {
      const UpdatedUser = await User.update(req.body, parseInt(idUser, 10));
      console.log(UpdatedUser);
      return res.status(201).send('USER MODIFIED');
    }
    return res.status(401).send('USER NOT FOUND');
  } catch (err) {
    console.log(err);
  }
}) as RequestHandler);

userController.delete('/:idUser', (async (req: Request, res: Response) => {
  try {
    const { idUser } = req.params;
    const deletedUser = await User.destroy(parseInt(idUser, 10));
  } catch (err) {
    console.log(err);
  }
}) as RequestHandler);

export default userController;
