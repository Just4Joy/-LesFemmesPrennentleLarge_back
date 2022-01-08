import connection from '../helpers/db-config';
import Joi from 'joi';
import ISession from '../interfaces/ISession';
import { ResultSetHeader } from 'mysql2';
import { ErrorHandler } from '../helpers/errors';
import { Request, Response, NextFunction } from 'express';

const findSession = () => {
  return connection
    .promise()
    .query<ISession[]>('SELECT * FROM sessions', [])
    .then(([results]) => results);
};

const create = (session: ISession): Promise<number> => {
  const {
    name,
    date,
    spot_name,
    adress,
    nb_hiki_max,
    id_departement,
    id_surf_style,
  } = session;
  return connection
    .promise()
    .query<ResultSetHeader>(
      'INSERT INTO sessions (name, date, spot_name, adress, nb_hiki_max, id_departement, id_surf_style) VALUES (?,?,?,?,?,?,?)',
      [
        name,
        date,
        spot_name,
        adress,
        nb_hiki_max,
        id_departement,
        id_surf_style,
      ]
    )
    .then(([results]) => results.insertId);
};

const findOne = (id_session: number) => {
  return connection
    .promise()
    .query<ISession[]>('SELECT * FROM sessions WHERE id_session = ?', [
      id_session,
    ])
    .then(([results]) => results[0]);
};

const update = (
  id_session: number,
  newAttributes: ISession
): Promise<boolean> => {
  return connection
    .promise()
    .query<ResultSetHeader>('UPDATE sessions SET ? WHERE id_session = ?', [
      newAttributes,
      id_session,
    ])
    .then(([results]) => results.affectedRows === 1);
};

const sessionExists = (req: Request, res: Response, next: NextFunction) => {
  // Récupèrer l'id user de req.params
  const { idSession } = req.params;
  // Vérifier si le user existe
  findOne(Number(idSession))
    .then((sessionExists) => {
      // Si non, => erreur
      if (!sessionExists) {
        next(new ErrorHandler(404, `This session doesn't exist`));
      }
      // Si oui => next
      else {
        next();
      }
    })
    .catch((err: Error) => next(err));
};

const validateSession = (req: Request, res: Response, next: NextFunction) => {
  let required: Joi.PresenceMode = 'optional';
  if (req.method === 'POST') {
    required = 'required';
  }
  const errors = Joi.object({
    name: Joi.string().min(3).max(100).presence(required),
    date: Joi.date().presence(required),
    spot_name: Joi.string().min(2).max(100).presence(required),
    adress: Joi.string().min(2).max(255).presence(required),
    nb_hiki_max: Joi.number().integer().presence(required),
    id_departement: Joi.number().integer().presence(required),
    id_surf_style: Joi.number().integer().presence(required),
    carpool: Joi.number().integer().presence(required)
  }).validate(req.body, { abortEarly: false }).error;
  if (errors) {
    next(new ErrorHandler(422, errors.message));
  } else {
    next();
  }
};

export default {
  findSession,
  create,
  validateSession,
  findOne,
  update,
  sessionExists,
};
