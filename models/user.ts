import connection from '../helpers/db-config';
import IUser from '../interfaces/IUser';
import { ResultSetHeader } from 'mysql2';
import argon2 from 'argon2';
import Joi from 'joi';
import { ErrorHandler } from '../helpers/errors';
import { Request, Response, NextFunction } from 'express';

const hashingOptions = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,
  timeCost: 5,
  parallelism: 1,
};

const hashPassword = (password: string) => {
  return argon2.hash(password, hashingOptions);
};

const verifyPassword = (password: string, hashedPassword: string) => {
  return argon2.verify(hashedPassword, password, hashingOptions);
};

const validateUser = (req: Request, res: Response, next: NextFunction) => {
  let required: Joi.PresenceMode = 'optional';

  if (req.method === 'POST') {
    required = 'required';
  }

  const errors = Joi.object({
    firstname: Joi.string().max(100).presence(required),
    lastname: Joi.string().max(100).presence(required),
    city: Joi.string().max(100).optional(),
    email: Joi.string().email().max(100).presence(required),
    password: Joi.string().min(8).max(15).presence(required),
    zip_code: Joi.string().max(45).optional(),
    profile_pic: Joi.string().max(250).optional(),
    id_surf_skill: Joi.number().optional(),
    favorite_spot: Joi.string().optional(),
    created_date: Joi.date().optional(), /// domifiier pour required
    id_department: Joi.number().optional(),
    id_surf_style: Joi.number().optional(),
    wahine: Joi.boolean().truthy(1).falsy(0).presence(required),
    description: Joi.string().max(255).optional(),
    phone: Joi.string().max(10).presence(required),
    id: Joi.number().optional(),
    id_user: Joi.number().optional(),
    admin: Joi.number().optional(),
    wahine_request: Joi.boolean().truthy(1).falsy(0).optional(),
  }).validate(req.body, { abortEarly: false }).error;
  if (errors) {
    console.log(errors, 'VALIDATION');
    next(new ErrorHandler(422, errors.message));
  } else {
    next();
  }
};

const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const errors = Joi.object({
    email: Joi.string().email().max(255).required(),
    password: Joi.string().min(8).max(15).required(),
  }).validate(req.body, { abortEarly: false }).error;
  if (errors) {
    next(new ErrorHandler(422, errors.message));
  } else {
    next();
  }
};

const findAll = (sortBy: string = ''): Promise<IUser[]> => {
  let sql: string = 'SELECT *, id_user AS id from users';
  if (sortBy) {
    sql += ` ORDER BY ${sortBy}`;
  }
  return connection
    .promise()
    .query<IUser[]>(sql)
    .then(([users]) => users);
};

const findByEmail = (email: string): Promise<IUser> => {
  return connection
    .promise()
    .query<IUser[]>('SELECT * FROM users where email = ?', [email])
    .then(([user]) => user[0]);
};

const findOneById = (idUser: number, display?: string): Promise<IUser> => {
  let sql: string =
    'SELECT id_user, firstname, lastname, email, wahine, admin, wahine_request, id_user AS id from users WHERE id_user = ?';

  if (display === 'all') {
    sql = 'SELECT * from users WHERE id_user = ?';
  }

  return connection
    .promise()
    .query<IUser[]>(sql, [idUser])
    .then(([user]) => user[0]);
};

const update = (data: any, idUser: number) => {
  let sql = 'UPDATE users SET ';
  const sqlValues: Array<string | number | boolean> = [];
  let oneValue = false;

  if (data.firstname) {
    sql += 'firstname = ?';
    sqlValues.push(data.firstname);
    oneValue = true;
  }
  if (data.lastname) {
    sql += oneValue ? ', lastname = ?' : 'lastname = ?';
    sqlValues.push(data.lastname);
    oneValue = true;
  }
  if (data.city) {
    sql += oneValue ? ', city = ?' : 'city = ?';
    sqlValues.push(data.city);
    oneValue = true;
  }
  if (data.description) {
    sql += oneValue ? ', description = ?' : 'description = ?';
    sqlValues.push(data.description);
    oneValue = true;
  }
  if (data.favorite_spot) {
    sql += oneValue ? ', favorite_spot = ?' : 'favorite_spot = ?';
    sqlValues.push(data.favorite_spot);
    oneValue = true;
  }
  if (data.id_department) {
    sql += oneValue ? ', id_department = ?' : 'id_department = ?';
    sqlValues.push(data.id_department);
    oneValue = true;
  }
  if (data.id_surf_style) {
    sql += oneValue ? ', id_surf_style = ?' : 'id_surf_style = ?';
    sqlValues.push(data.id_surf_style);
    oneValue = true;
  }
  if (data.profile_pic) {
    sql += oneValue ? ', profile_pic = ?' : 'profile_pic = ?';
    sqlValues.push(data.profile_pic);
    oneValue = true;
  }
  if (data.email) {
    sql += oneValue ? ', email = ?' : 'email = ?';
    sqlValues.push(data.email);
    oneValue = true;
  }

  if (data.wahine_request != undefined) {
    sql += oneValue ? ', wahine_request = ?' : 'wahine_request = ?';
    sqlValues.push(data.wahine_request);
    oneValue = true;
  }
  
  if (data.wahine != undefined) {
    sql += oneValue
      ? ', wahine = ?, wahine_request = ?'
      : 'wahine = ?, wahine_request = ?';
    sqlValues.push(data.wahine);
    sqlValues.push(0);
    oneValue = true;
  }
  if (data.admin != undefined) {
    sql += oneValue ? ', admin = ?' : 'admin = ?';
    sqlValues.push(data.admin);
    oneValue = true;
  }



  sql += ' WHERE id_user = ?';
  sqlValues.push(idUser);

  return connection
    .promise()
    .query<ResultSetHeader>(sql, sqlValues)
    .then(([user]) => user.affectedRows === 1);
};

const destroy = (idUser: number) => {
  return connection
    .promise()
    .query<IUser[]>('DELETE FROM users WHERE id_user = ?', [idUser]);
};

const create = async (payload: IUser) => {
  const createdDateServ = new Date()
    .toISOString()
    .slice(0, 19)
    .replace('T', ' ');
  const { firstname, lastname, email, password, wahine, phone } = payload;
  const hashedPassword = await hashPassword(password);

  return connection
    .promise()
    .query<ResultSetHeader>(
      'INSERT INTO users (firstname, lastname, email, password, created_date, wahine, phone) VALUES (?,?,?,?,?,?,?)',
      [
        firstname,
        lastname,
        email,
        hashedPassword,
        createdDateServ,
        wahine,
        phone,
      ]
    );
};

const findBySession = (idSession: number) => {
  return connection
    .promise()
    .query<IUser[]>(
      'SELECT u.* FROM users as u INNER JOIN users_has_sessions ON users_has_sessions.id_user = u.id_user WHERE users_has_sessions.id_session = ?',
      [idSession]
    )
    .then(([users]) => users);
};

const subscribe = (idUser: number, idSession: number) => {
  return connection
    .promise()
    .query<ResultSetHeader>(
      'INSERT INTO users_has_sessions (id_user, id_session) VALUES (?,?)',
      [idUser, idSession]
    )
    .then(([userHasSession]) => userHasSession.affectedRows === 1);
};

const unsubscribe = (idUser: number, idSession: number) => {
  return connection
    .promise()
    .query<ResultSetHeader>(
      'DELETE FROM users_has_sessions WHERE id_user = ? AND id_session = ?',
      [idUser, idSession]
    )
    .then(([userHasSession]) => userHasSession.affectedRows === 1);
};

const User = {
  findAll,
  create,
  findByEmail,
  findOneById,
  update,
  destroy,
  validateUser,
  validateLogin,
  verifyPassword,
  findBySession,
  subscribe,
  unsubscribe,
};

export default User;
