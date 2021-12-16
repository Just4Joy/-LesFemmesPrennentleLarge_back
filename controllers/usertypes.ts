const userTypeController = require('express').Router();
const UserType = require('../models/usertype');
import { Request, Response } from 'express';

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
      res.status(500).send('Error retrieving cars from database');
    });
});

module.exports = { userTypeController };
