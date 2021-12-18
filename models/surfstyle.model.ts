import connection from '../_utils/db-config';

const db = connection.promise();

const findSurfStyles = () => {
  const sql = `SELECT * FROM surf_style`;
  return db.query(sql).then(([results]: any) => results);
};

const SurfStyle = {
  findSurfStyles,
};

export default SurfStyle;
