import { Request, Response, NextFunction } from 'express';
import express = require('express');
import ISurfSkill from '../interfaces/ISurfskills';
import SurfSkills from '../models/surfskill';

const surfskillsController = express.Router();

surfskillsController.get('/coucou', (req: Request, res: Response) => {
  res.status(200).send('hibou');
});

surfskillsController.get(
  '/',
  (req: Request, res: Response, next: NextFunction) => {
    SurfSkills.findSurfSkills()
      .then((surfskill: ISurfSkill[]) => {
        res.json(surfskill);
      })
      .catch((err) => {
        next(err);
      });
  }
);

surfskillsController.get('/:id_surf_skill', (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id_surf_skill } = req.params as ISurfSkill;
  try {
    const result: ISurfSkill = await SurfSkills.findSurfSkillsById(
      id_surf_skill
    );

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}) as express.RequestHandler);

export default surfskillsController;
