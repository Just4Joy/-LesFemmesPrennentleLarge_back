import express from 'express';
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

departementsController.get(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params as IDepartement;
    try {
      const result: IDepartement = await Departement.findDepartmentById(id);
      console.log(result);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
);

export default departementsController;
