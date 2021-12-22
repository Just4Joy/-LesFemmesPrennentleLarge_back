import express = require('express');
import { Request, Response, NextFunction } from 'express';
import Departement from '../models/departement';
import IDepartement from '../interfaces/IDepartement';

const departementsController = express.Router();

/// /////////////////// GET ALL /////////////////////
departementsController.get(
  '/',
  (req: Request, res: Response, next: NextFunction) => {
    Departement.findAll()
      .then((departements: IDepartement[]) => {
        res.status(200).json(departements);
      })
      .catch((err: Error) => {
        next(err);
      });
  }
);

export default departementsController;
