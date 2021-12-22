import connection from '../_utils/db-config';
const Joi = require('joi');

const findSession = () => {
  const sql = 'SELECT * FROM session';
  return connection
    .promise()
    .query(sql, [])
    .then(([results]: any) => results);
};

interface ISession {
  name: string;
  date: string;
  spot_name: string;
  adress: string;
  nb_hiki_max: number;
  id_departement: number;
  id_surf_style: number;
}

const create = (session: ISession) => {
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
    .query(
      'INSERT INTO session (name, date, spot_name, adress, nb_hiki_max, id_departement, id_surf_style) VALUES (?,?,?,?,?,?,?)',
      [
        name,
        date,
        spot_name,
        adress,
        nb_hiki_max,
        id_departement,
        id_surf_style,
      ]
    );
};

const findOne = (id_session: number) => {
  return connection
    .promise()
    .query('SELECT * FROM session WHERE id_session = ?', [id_session])
    .then(([results]: any) => results[0]);
};

const update = (id_session: number, newAttributes: any) => {
  return connection
    .promise()
    .query('UPDATE session SET ? WHERE id_session = ?', [
      newAttributes,
      id_session,
    ]);
};

const validate = (data: any) => {
  return Joi.object({
    name: Joi.string().min(3).max(100),
    date: Joi.date(),
    spot_name: Joi.string().min(2).max(100),
    adress: Joi.string().min(2).max(255),
    nb_hiki_max: Joi.number().integer(),
    id_departement: Joi.number().integer(),
    id_surf_style: Joi.number().integer(),
  }).validate(data, { abortEarly: false }).error;
};

const Session = {
  findSession,
  create,
  validate,
  findOne,
  update,
};

export default Session;
