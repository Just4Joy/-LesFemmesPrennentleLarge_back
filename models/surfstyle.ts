import connection from '../_utils/db-config';
const db = connection.promise();

const findSurfStyles = () => {
  let sql = `SELECT * FROM surf_style`;
  return db.query(sql).then(([results]: any) => results);
};

module.exports = {
  findSurfStyles,
};
