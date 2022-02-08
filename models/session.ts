import connection from '../helpers/db-config';
import Joi from 'joi';
import ISession from '../interfaces/ISession';
import { ResultSetHeader } from 'mysql2';
import { ErrorHandler } from '../helpers/errors';
import { Request, Response, NextFunction } from 'express';

const findAll = (
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
    sql += ' WHERE date > NOW()';
    sql += ' ORDER BY date ASC LIMIT ?';
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
    .then(([sessions]) => sessions);
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
    .then(([session]) => session.insertId);
};

const findOne = (idSession: number, display?: string) => {
  let sql: string =
    'SELECT id_session AS id, sessions.name, DATE_FORMAT(date, "%Y/%m/%d %H:%i:%s") AS date, spot_name, address, nb_hiki_max, sessions.id_department, id_surf_style, carpool, id_user, DATE_FORMAT(date, "%d/%m/%Y") AS nice_date, DATE_FORMAT(date, "%kh%i") AS nice_time FROM sessions WHERE id_session = ?';

  if (display === 'all') {
    sql =
      'SELECT *, DATE_FORMAT(date, "%d/%m/%Y") AS nice_date, DATE_FORMAT(date, "%kh%i") AS nice_time FROM sessions WHERE id_session = ?';
  }

  return connection
    .promise()
    .query<ISession[]>(sql, [idSession])
    .then(([session]) => session[0]);
};

const update = (
  id_session: number,
  newAttributes: ISession
): Promise<boolean> => {
  let sql = 'UPDATE sessions SET ';
  const sqlValues: Array<string | number | boolean | Date> = [];
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
    .then(([session]) => session.affectedRows === 1);
};

const sessionExists = (req: Request, res: Response, next: NextFunction) => {
  // Retrieves the idUser from req.params
  const { idSession } = req.params;
  // Verifies if the user exists
  findOne(Number(idSession))
    .then((sessionExists) => {
      // If false, => error
      if (!sessionExists) {
        next(new ErrorHandler(404, `This session doesn't exist`));
      }
      // If true => next
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
    console.log(errors);
    next(new ErrorHandler(422, errors.message));
  } else {
    next();
  }
};

const checkIfUserHasSubscribe = (idUser: number, idSession: number) => {
  return connection
    .promise()
    .query<ResultSetHeader>(
      'SELECT * FROM users_has_sessions WHERE id_user = ? AND id_session = ?',
      [idUser, idSession]
    )
    .then(([userHasSession]) => userHasSession.affectedRows === 1);
};

const destroy = (id: number) => {
  return connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM sessions WHERE id_session = ?', [id])
    .then(([session]) => session.affectedRows > 0);
};

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
    .then(([sessions]) => {
      return sessions;
    });
};

export default {
  findAll,
  create,
  validateSession,
  findOne,
  update,
  sessionExists,
  checkIfUserHasSubscribe,
  destroy,
  findSessionsByIdUser,
};
