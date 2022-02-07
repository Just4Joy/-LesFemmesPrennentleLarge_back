import connection from '../helpers/db-config';
import Joi from 'joi';
import ISession from '../interfaces/ISession';
import { ResultSetHeader } from 'mysql2';
import { ErrorHandler } from '../helpers/errors';
import { Request, Response, NextFunction } from 'express';

const findSession = (
  region: number,
  limit: number,
  date: string,
  pages: number,
  wahine: number,
  sortBy = ''
): Promise<ISession[]> => {
  let sql =
    'SELECT id_session AS id, id_session, sessions.name, DATE_FORMAT(date, "%Y/%m/%d %H:%i:%s") AS date, spot_name, address, nb_hiki_max, sessions.id_department, id_surf_style, carpool, id_user, DATE_FORMAT(date, "%d/%m/%Y") AS nice_date, DATE_FORMAT(date, "%kh%i") AS nice_time FROM sessions';
  const sqlValue: Array<string | number> = [];

  if (wahine) {
    sql += ` WHERE id_user = ?`;
    sqlValue.push(wahine);
  }
  if (region) {
    sql +=
      ' INNER JOIN departments ON sessions.id_department=departments.id_department INNER JOIN regions ON departments.id_region=regions.id_region WHERE departments.id_region = ?';
    sqlValue.push(region);
    if (date) {
      sql += ' AND DATE_FORMAT(date, "%Y-%m-%d") = ?';
      sqlValue.push(date);
    }
  }
  if (date && !region) {
    sql += ' WHERE DATE_FORMAT(date, "%Y-%m-%d") = ?';
    sqlValue.push(date);
  }

  if (limit === 3) {
    sql += ' ORDER BY date DESC LIMIT ?';
    sqlValue.push(3);
  } else {
    if (pages === 0) {
      sql += ' ORDER BY date DESC LIMIT ?';
      sqlValue.push(9);
    } else if (pages > 0) {
      sql += ' ORDER BY date DESC LIMIT ? OFFSET ?';
      sqlValue.push(9, pages);
    }
  }
  if (sortBy) {
    sql += ` ORDER BY ${sortBy}`;
  }

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

const findOne = (id_session: number, display?: string) => {
  let sql =
    'SELECT id_session AS id, sessions.name, DATE_FORMAT(date, "%Y/%m/%d %H:%i:%s") AS date, spot_name, address, nb_hiki_max, sessions.id_department, id_surf_style, carpool, id_user, DATE_FORMAT(date, "%d/%m/%Y") AS nice_date, DATE_FORMAT(date, "%kh%i") AS nice_time FROM sessions WHERE id_session = ?';

  if (display === 'all') {
    sql =
      'SELECT *, DATE_FORMAT(date, "%d/%m/%Y") AS nice_date, DATE_FORMAT(date, "%kh%i") AS nice_time FROM sessions WHERE id_session = ?';
  }

  return connection
    .promise()
    .query<ISession[]>(sql, [id_session])
    .then(([results]) => results[0]);
};

const update = (
  id_session: number,
  newAttributes: ISession
): Promise<boolean> => {
  let sql = 'UPDATE sessions SET ';
  const sqlValues: Array<string | number | boolean> = [];
  let oneValue = false;

  if (newAttributes.name) {
    sql += 'name = ? ';
    sqlValues.push(newAttributes.name);
    oneValue = true;
  }
  if (newAttributes.spot_name) {
    sql += oneValue ? ', spot_name = ? ' : ' spot_name = ? ';
    sqlValues.push(newAttributes.spot_name);
    oneValue = true;
  }
  if (newAttributes.date) {
    sql += oneValue ? ', date = ? ' : ' date = ? ';
    sqlValues.push(newAttributes.date);
    oneValue = true;
  }
  if (newAttributes.address) {
    sql += oneValue ? ', address = ? ' : ' address = ? ';
    sqlValues.push(newAttributes.address);
    oneValue = true;
  }
  if (newAttributes.nb_hiki_max) {
    sql += oneValue ? ', nb_hiki_max = ? ' : ' nb_hiki_max = ? ';
    sqlValues.push(newAttributes.nb_hiki_max);
    oneValue = true;
  }
  if (newAttributes.carpool != undefined) {
    sql += oneValue ? ', carpool = ? ' : ' carpool = ? ';
    sqlValues.push(newAttributes.carpool);
    oneValue = true;
  }
  sql += ' WHERE id_session = ?';
  sqlValues.push(id_session);

  return connection
    .promise()
    .query<ResultSetHeader>(sql, sqlValues)
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
    date: Joi.string().presence(required),
    spot_name: Joi.string().min(2).max(100).presence(required),
    address: Joi.string().min(2).max(255).presence(required),
    nb_hiki_max: Joi.number().integer().presence(required),
    id_department: Joi.number().integer().presence(required),
    id_surf_style: Joi.number().integer().presence(required),
    carpool: Joi.number().integer().presence(required),
    id_user: Joi.number().integer().presence(required),
    nice_time: Joi.string().optional(),
    nice_date: Joi.string().optional(),
    id: Joi.number().integer().optional(),
  }).validate(req.body, { abortEarly: false }).error;
  if (errors) {
    next(new ErrorHandler(422, errors.message));
  } else {
    next();
  }
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

const destroy = (id: number) => {
  return connection
    .promise()
    .query<ISession[]>('DELETE FROM sessions WHERE id_session = ?', [id]);
};

// const findSessionByUser = (id: number) => {
//   return connection
//     .promise()
//     .query<ISession[]>(
//       `SELECT s.* FROM sessions as s
//   INNER JOIN users_has_sessions as us ON s.id_session = us.id_session
//   WHERE us.id_user = ?`,
//       [id]
//     )
//     .then(([results]) => results);
// };

const findSessionsByIdUser = (idUser: number) => {
  return connection
    .promise()
    .query<ISession[]>(
      `SELECT s.id_session, s.name, DATE_FORMAT(s.date, "%Y/%m/%d %H:%i:%s") AS date, s.spot_name, s.address, s.nb_hiki_max, s.id_department, s.id_surf_style, s.carpool, s.id_user, DATE_FORMAT(s.date, "%d/%m/%Y") AS nice_date, DATE_FORMAT(s.date, "%kh%i") AS nice_time 
      FROM sessions s 
      INNER JOIN users_has_sessions us 
      ON s.id_session = us.id_session 
      AND us.id_user = ?`,
      [idUser]
    )
    .then(([results]) => {
      return results;
    });
};

export default {
  findSession,
  create,
  validateSession,
  findOne,
  update,
  sessionExists,
  checkIfUserHasSubscribe,
  destroy,
  findSessionsByIdUser,
  // findSessionByUser,
};
