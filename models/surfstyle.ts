import ISurfStyle from '../interfaces/ISurfStyle';
import connection from '../helpers/db-config';

const db = connection.promise();

const findAll = () => {
  return db
    .query<ISurfStyle[]>(`SELECT * FROM surf_styles`)
    .then(([results]) => results);
};

export default {
  findAll,
};
