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

departmentsController.get('/:id_department', (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id_department } = req.params as IDepartment;
  try {
    const result: IDepartment = await Department.findDepartmentById(
      id_department
    );

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}) as RequestHandler);

export default departmentsController;
