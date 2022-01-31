import connection from '../helpers/db-config';
import ISurfSkills from '../interfaces/ISurfskills';

const db = connection.promise();

const findSurfSkills = () => {
  const sql = `SELECT * FROM surf_skills`;
  return db.query<ISurfSkills[]>(sql).then(([results]) => results);
};

const findSurfSkillsByUser = (id: number) => {
  return db
    .query<ISurfSkills[]>(
      `SELECT s.* FROM surf_skills as s 
    INNER JOIN users_has_surf_skills as us ON s.id_surf_skill = us.id_surf_skill 
    WHERE us.id_user = ?`,
      [id]
    )
    .then(([results]) => results);
};

const findSurfSkillsById = (id: number) => {
  return db
    .query<ISurfSkills[]>(`SELECT * FROM surf_skills WHERE id_surf_skill = ?`, [
      id,
    ])
    .then(([results]) => results[0]);
};

const create = (id_user: number, id_surf_skill: number) => {
  return connection
    .promise()
    .query<ISurfSkills[]>(
      'INSERT INTO users_has_surf_skills (id_user, id_surf_skill) VALUES (?,?)',
      [id_user, id_surf_skill]
    )
    .then(([result]) => result);
};

const destroyAll = (id_user: number) => {
  return connection
    .promise()
    .query<ISurfSkills[]>(
      'DELETE FROM users_has_surf_skills WHERE id_user = ?',
      [id_user]
    );
};

const SurfSkills = {
  findSurfSkills,
  findSurfSkillsById,
  findSurfSkillsByUser,
  create,
  destroyAll,
};

export default SurfSkills;
