import express = require('express');
import { Request, Response } from 'express';
import User from '../models/user';
import Schema from '../_utils/validator';

const userController = express.Router();

userController.get('/', async (req: Request, res: Response) => {
  const result = await User.findMany();
  res.status(200).json(result);
});

userController.post('/', async (req: Request, res: Response) => {
  const validation = Schema.validate(req.body);
  if (validation.error) {
    return res.status(422).json(validation.error.message);
  }
  const { email } = req.body;
  const existingEmail: any = await User.findByEmail(email);
  if (existingEmail[0]) {
    return res.status(400).json('BAD REQUEST EMAIL ALREADY EXIST');
  }
  const response: any = await User.create(req.body);
  return res.status(200).json({ id_user: response[0].insertId, ...req.body });
});

export default userController;
