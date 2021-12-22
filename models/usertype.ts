import IUserType from '../interfaces/IUserType';
import connection from '../_utils/db-config';

const db = connection.promise();

const findAll = () => {
  const sql = `SELECT * FROM user_types`;
  return db.query<IUserType[]>(sql).then(([results]) => results);
};


export default {
  findAll,
};
