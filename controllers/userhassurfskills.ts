import express, { response } from 'express';
import UserHasSurfSkills from '../models/userhassurfskill';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import IUserhassurfskills from '../interfaces/IUserhassurfskills';
import { ResultSetHeader } from 'mysql2';

const userHasSurfSkillsController = express.Router();

userHasSurfSkillsController.get('/:id_user', (async (
  req: Request,
  res: Response
) => {
  const { id_user } = req.params;
  const userSurfSkills = await UserHasSurfSkills.getSurfSkillsByUser(
    parseInt(id_user, 10)
  );
  console.log(userSurfSkills);
  res.status(200).json(userSurfSkills);
}) as RequestHandler);

userHasSurfSkillsController.post('/:id_user/:id_surf_skill', (async (
  req: Request,
  res: Response
) => {
  const { id_user, id_surf_skill } = req.params;
  try {
    const created = await UserHasSurfSkills.create(
      parseInt(id_user, 10),
      parseInt(id_surf_skill)
    );
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json(err);
  }
}) as RequestHandler);

userHasSurfSkillsController.delete('/:id_user/:id_surf_skill', (async (
  req: Request,
  res: Response
) => {
  const { id_user, id_surf_skill } = req.params;
  try {
    const created = await UserHasSurfSkills.destroy(
      parseInt(id_user, 10),
      parseInt(id_surf_skill)
    );
    res.status(204).json('RESSOURCE DELETED');
  } catch (err) {
    res.status(500).json(err);
  }
}) as RequestHandler);

export default userHasSurfSkillsController;
