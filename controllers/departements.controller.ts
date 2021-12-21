import express = require('express');
import { Request, Response } from 'express';
import Departement from '../models/departement.model';

const departementsController = express.Router();

/// /////////////////// GET ALL /////////////////////
departementsController.get('/', (req: Request, res: Response) => {
  Departement.findAll()
    .then((departement: any) => {
      res.status(200).json(departement);
    })
    .catch((err: any) => {
      res.status(401).send(err);
    });
});

export default departementsController;
