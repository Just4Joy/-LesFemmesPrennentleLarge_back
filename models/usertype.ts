import connection from '../_utils/db-config';
const db = connection.promise();

const findUserTypes = () => {
  let sql = `SELECT * FROM user_type`;
  return db.query(sql).then(([results]) => results);
};

module.exports = {
  findUserTypes,
};
