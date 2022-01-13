import connection from '../helpers/db-config';
import ISurfSkills from '../interfaces/ISurfskills';

const db = connection.promise();

const findSurfSkills = () => {
  const sql = `SELECT * FROM surf_skills`;
  return db.query<ISurfSkills[]>(sql).then(([results]) => results);
};

const findSurfSkillsById = (id: number) => {
  return db
    .query<ISurfSkills[]>(`SELECT * FROM surf_skills WHERE id_surf_skill = ?`, [
      id,
    ])
    .then(([results]) => results[0]);
};

const SurfSkills = {
  findSurfSkills,
  findSurfSkillsById,
};

export default SurfSkills;
