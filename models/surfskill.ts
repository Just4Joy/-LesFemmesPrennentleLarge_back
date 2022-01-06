import connection from '../helpers/db-config';
import ISurfSkills from '../interfaces/ISurfskills';

const db = connection.promise();

const findSurfSkills = () => {
  const sql = `SELECT * FROM surf_skill`;
  return db.query<ISurfSkills[]>(sql).then(([results]) => results);
};

const SurfSkills = {
  findSurfSkills,
};

export default SurfSkills;
