import connection from '../_utils/db-config';

const db = connection.promise();

const findUserTypes = () => {
  const sql = `SELECT * FROM user_type`;
  return db.query(sql).then(([results]) => results);
};
const userType = {
  findUserTypes,
};

export default userType;
