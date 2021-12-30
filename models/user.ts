import connection from '../helpers/db-config';
import IUser from '../interfaces/IUser';
import { ResultSetHeader } from 'mysql2';
import { query } from 'express';
//import { ErrorHandler } from '../helpers/errors';

const findMany = () => {
  const sql = 'SELECT * FROM users';
  return connection
    .promise()
    .query<IUser[]>(sql, [])
    .then(([results]) => results);
};

const findByEmail = (email: string) => {
  return connection
    .promise()
    .query<IUser[]>('SELECT * FROM users where email = ?', [email])
    .then(([results]) => results);
};

const findOneById = (id: number) => {
  return connection
    .promise()
    .query<IUser[]>('SELECT * FROM users where id_user = ?', [id])
    .then(([results]) => results);
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

const create = (payload: IUser) => {
  const {
    firstname,
    lastname,
    city,
    email,
    password,
    zipCode,
    profilePic,
    idSurfSkill,
    favoriteSpot,
    createdDate,
    idDepartement,
    idSurfStyle,
  } = payload;
  return connection
    .promise()
    .query<ResultSetHeader>(
      'INSERT INTO users (firstname, lastname, city, email, password_hash, zip_code, profile_pic, id_surf_skill, favorite_spot, created_date, id_departement, id_surf_style) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
      [
        firstname,
        lastname,
        city,
        email,
        password,
        zipCode,
        profilePic,
        idSurfSkill,
        favoriteSpot,
        createdDate,
        idDepartement,
        idSurfStyle,
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
};

export default User;
