import express from 'express';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import Department from '../models/department';
import IDepartment from '../interfaces/IDepartment';

const departmentsController = express.Router();

/// /////////////////// GET ALL /////////////////////
departmentsController.get(
  '/',
  (req: Request, res: Response, next: NextFunction) => {
    Department.findAll()
      .then((departments: IDepartment[]) => {
        res.status(200).json(departments);
      })
      .catch((err: Error) => {
        next(err);
      });
  }
);

departmentsController.get(
  '/:idDepartment',
  async (req: Request, res: Response, next: NextFunction) => {
    const { idDepartment } = req.params as IDepartment;
    try {
      const department: IDepartment = await Department.findOneById(
        idDepartment
      );

      res.status(200).json(department);
    } catch (err) {
      next(err);
    }
  }
);

export default departmentsController;
