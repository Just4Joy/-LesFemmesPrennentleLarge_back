import connection from '../_utils/db-config';
const db = connection.promise();

const findSurfSkills = () => {
  let sql = `SELECT * FROM surf_skill`;
  return db.query(sql).then(([results]: any) => results);
};

module.exports = {
  findSurfSkills,
};
