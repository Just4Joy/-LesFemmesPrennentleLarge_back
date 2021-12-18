import express = require('express');
import { Request, Response } from 'express';
import User from '../models/user.model';

const userController = express.Router();

userController.get('/', async (req: Request, res: Response) => {
  const result = await User.findMany();
  res.status(200).json(result);
});

export default userController;
