import connection from '../helpers/db-config';
import IUser from '../interfaces/IUser';
import { ResultSetHeader } from 'mysql2';
import { query } from 'express';
import argon2 from 'argon2';
import Joi, { optional } from 'joi';
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
    city: Joi.string().max(100).presence(required),
    email: Joi.string().email().max(100).presence(required),
    password: Joi.string().min(8).max(15).presence(required),
    zip_code: Joi.string().max(45).presence(required),
    profile_pic: Joi.string().max(250).presence(required),
    id_surf_skill: Joi.number().presence(required),
    favorite_spot: Joi.string().max(45).presence(required),
    created_date: Joi.date().optional(), /// domifiier pour required
    id_departement: Joi.number().presence(required),
    id_surf_style: Joi.number().presence(required),
    wahine: Joi.boolean().truthy(1).falsy(0).presence(required),
  }).validate(req.body, { abortEarly: false }).error;
  if (errors) {
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

const findMany = () => {
  const sql = 'SELECT * FROM users';
  return connection
    .promise()
    .query<IUser[]>(sql, [])
    .then(([results]) => results);
};

const findByEmail = (email: string): Promise<IUser> => {
  return connection
    .promise()
    .query<IUser[]>('SELECT * FROM users where email = ?', [email])
    .then(([results]) => results[0]);
};

const findOneById = (id: number): Promise<IUser> => {
  return connection
    .promise()
    .query<IUser[]>('SELECT * FROM users where id_user = ?', [id])
    .then(([results]) => results[0]);
};

const update = (data: any, id: number) => {
  return connection
    .promise()
    .query<ResultSetHeader>('UPDATE users SET ? WHERE id_user = ?', [data, id])
    .then(([results]) => results);
};

const destroy = (id: number) => {
  return connection
    .promise()
    .query<IUser[]>('DELETE FROM users WHERE id_user = ?', [id]);
};

const create = async (payload: IUser) => {
  console.log(payload);
  const createdDateServ = new Date()
    .toISOString()
    .slice(0, 19)
    .replace('T', ' ');
  console.log(createdDateServ);
  const {
    firstname,
    lastname,
    city,
    email,
    password,
    zip_code,
    profile_pic,
    id_surf_skill,
    favorite_spot,
    created_date,
    id_departement,
    id_surf_style,
    wahine,
  } = payload;
  const hashedPassword = await hashPassword(password);

  return connection
    .promise()
    .query<ResultSetHeader>(
      'INSERT INTO users (firstname, lastname, city, email, password, zip_code, profile_pic, id_surf_skill, favorite_spot, created_date, id_departement, id_surf_style, wahine) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)',
      [
        firstname,
        lastname,
        city,
        email,
        hashedPassword,
        zip_code,
        profile_pic,
        id_surf_skill,
        favorite_spot,
        created_date,
        id_departement,
        id_surf_style,
        wahine,
      ]
    );
};

const User = {
  findMany,
  create,
  findByEmail,
  findOneById,
  update,
  destroy,
  validateUser,
  validateLogin,
  verifyPassword,
};

export default User;
