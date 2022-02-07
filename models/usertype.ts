import IUserType from '../interfaces/IUserType';
import connection from '../helpers/db-config';

const db = connection.promise();

const findAll = () => {
  const sql = `SELECT * FROM user_types`;
  return db.query<IUserType[]>(sql).then(([userTypes]) => userTypes);
};

export default {
  findAll,
};
