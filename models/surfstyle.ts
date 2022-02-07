import ISurfStyle from '../interfaces/ISurfStyle';
import connection from '../helpers/db-config';

const db = connection.promise();

const findAll = () => {
  return db
    .query<ISurfStyle[]>(`SELECT * FROM surf_styles`)
    .then(([surfStyles]) => surfStyles);
};

const findSurfStyleById = (idSurfStyle: number) => {
  return db
    .query<ISurfStyle[]>(`SELECT * FROM surf_styles WHERE id_surf_style = ?`, [
      idSurfStyle,
    ])
    .then(([surfStyle]) => surfStyle[0]);
};

export default {
  findAll,
  findSurfStyleById,
};
