import ISurfStyle from '../interfaces/ISurfStyle';
import connection from '../helpers/db-config';

const db = connection.promise();

const findAll = () => {
  return db
    .query<ISurfStyle[]>(`SELECT * FROM surf_styles`)
    .then(([results]) => results);
};

const findSurfStyleById = (id: number) => {
  return db
    .query<ISurfStyle[]>(`SELECT * FROM surf_styles WHERE id_surf_style = ?`, [
      id,
    ])
    .then(([results]) => results[0]);
};

export default {
  findAll,
  findSurfStyleById,
};
