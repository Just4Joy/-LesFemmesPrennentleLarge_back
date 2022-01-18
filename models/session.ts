import connection from '../helpers/db-config';
import Joi from 'joi';
import ISession from '../interfaces/ISession';
import { ResultSetHeader } from 'mysql2';
import { ErrorHandler } from '../helpers/errors';
import { Request, Response, NextFunction } from 'express';

const findSession = (region: number, limit: number, date: string) => {
  let sql =
    'SELECT sessions.name, DATE_FORMAT(date, "%Y/%m/%d %H:%i:%s") AS date, spot_name, address, nb_hiki_max, sessions.id_department, id_surf_style, carpool, id_user, DATE_FORMAT(date, "%d/%m/%Y") AS nice_date, DATE_FORMAT(date, "%kh%i") AS nice_time FROM sessions';
  const sqlValue: Array<string | number> = [];
  if (region) {
    sql +=
      ' INNER JOIN departments ON sessions.id_department=departments.id_department INNER JOIN regions ON departments.id_region=regions.id_region WHERE departments.id_region = ?';
    sqlValue.push(region);
  }
  if (date) {
    region ? (sql += ' AND date = ?') : (sql += ' WHERE date = ?');
    sqlValue.push(date);
  }
  if (limit) {
    sql += ` LIMIT ?`;
    sqlValue.push(limit);
  }
  console.log(sql);
  console.log(sqlValue);
  return connection
    .promise()
    .query<ISession[]>(sql, sqlValue)
    .then(([results]) => results);
};

const create = (session: ISession): Promise<number> => {
  const {
    name,
    date,
    spot_name,
    address,
    nb_hiki_max,
    id_department,
    id_surf_style,
    carpool,
    id_user,
  } = session;
  return connection
    .promise()
    .query<ResultSetHeader>(
      'INSERT INTO sessions (name, date, spot_name, address, nb_hiki_max, id_department, id_surf_style, carpool, id_user) VALUES (?,?,?,?,?,?,?,?,?)',
      [
        name,
        date,
        spot_name,
        address,
        nb_hiki_max,
        id_department,
        id_surf_style,
        carpool,
        id_user,
      ]
    )
    .then(([results]) => results.insertId);
};

const findOne = (id_session: number) => {
  return connection
    .promise()
    .query<ISession[]>(
      'SELECT *, DATE_FORMAT(date, "%d/%m/%Y") AS nice_date, DATE_FORMAT(date, "%kh%i") AS nice_time FROM sessions WHERE id_session = ?',
      [id_session]
    )
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
    address: Joi.string().min(2).max(255).presence(required),
    nb_hiki_max: Joi.number().integer().presence(required),
    id_department: Joi.number().integer().presence(required),
    id_surf_style: Joi.number().integer().presence(required),
    carpool: Joi.number().integer().presence(required),
    id_user: Joi.number().integer().presence(required),
  }).validate(req.body, { abortEarly: false }).error;
  if (errors) {
    next(new ErrorHandler(422, errors.message));
  } else {
    next();
  }
};

const subscribe = (id_user: number, id_session: number) => {
  return connection
    .promise()
    .query<ResultSetHeader>(
      'INSERT INTO users_has_sessions (id_user, id_session) VALUES (?,?)',
      [id_user, id_session]
    )
    .then(([result]) => result);
};

const unsubscribe = (id_user: number, id_session: number) => {
  return connection
    .promise()
    .query<ResultSetHeader>(
      'DELETE FROM users_has_sessions WHERE id_user = ? AND id_session = ?',
      [id_user, id_session]
    );
};

const checkIfUserHasSubscribe = (id_user: number, id_session: number) => {
  return connection
    .promise()
    .query<ResultSetHeader>(
      'SELECT * FROM users_has_sessions WHERE id_user = ? AND id_session = ?',
      [id_user, id_session]
    )
    .then(([result]) => result);
};

const allUserBySession = (id_session: number) => {
  return connection
    .promise()
    .query<ResultSetHeader>(
      'SELECT users_has_sessions.id_session, users_has_sessions.id_user, users.firstname, users.lastname FROM users_has_sessions INNER JOIN users ON users_has_sessions.id_user = users.id_user WHERE id_session = ?',
      [id_session]
    )
    .then(([result]) => result);
};

export default {
  findSession,
  create,
  validateSession,
  findOne,
  update,
  sessionExists,
  subscribe,
  unsubscribe,
  checkIfUserHasSubscribe,
  allUserBySession,
};
