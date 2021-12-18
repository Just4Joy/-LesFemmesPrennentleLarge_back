import { Request, Response } from 'express';
import express = require('express');
import UserType from '../models/usertype.model';

const userTypeController = express.Router();

userTypeController.get('/coucou', (req: Request, res: Response) => {
  res.status(200).send('hibou');
});

userTypeController.get('/', (req: Request, res: Response) => {
  UserType.findUserTypes()
    .then((usertypes: any) => {
      res.json(usertypes);
    })
    .catch((err: any) => {
      console.log(err);
      res.status(500).send('Error retrieving usertypes from database');
    });
});

export default userTypeController;
