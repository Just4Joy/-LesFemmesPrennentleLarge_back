import express from 'express';
import { Request, Response, NextFunction } from 'express';
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
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params as IDepartment;
    try {
      const result: IDepartment = await Department.findDepartmentById(id);

      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
);

export default departmentsController;
