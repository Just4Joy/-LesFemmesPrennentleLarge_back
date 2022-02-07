import { Request, Response, NextFunction } from 'express';
import express = require('express');
import ISurfSkill from '../interfaces/ISurfskill';
import SurfSkill from '../models/surfskill';

const surfskillsController = express.Router();

surfskillsController.get('/coucou', (req: Request, res: Response) => {
  res.status(200).send('hibou');
});

surfskillsController.get(
  '/',
  (req: Request, res: Response, next: NextFunction) => {
    SurfSkill.findAll()
      .then((surfskills) => {
        res.json(surfskills);
      })
      .catch((err) => {
        next(err);
      });
  }
);

surfskillsController.get(
  '/:idSurfSkill',
  async (req: Request, res: Response, next: NextFunction) => {
    const { idSurfSkill } = req.params as ISurfSkill;
    try {
      const result = await SurfSkill.findOneById(idSurfSkill);

      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
);

export default surfskillsController;
