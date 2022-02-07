import connection from '../helpers/db-config';
import ISurfSkills from '../interfaces/ISurfskill';

const db = connection.promise();

const findAll = () => {
  const sql = `SELECT * FROM surf_skills`;
  return db.query<ISurfSkills[]>(sql).then(([surfSkills]) => surfSkills);
};

const findOneByUser = (idUser: number) => {
  return db
    .query<ISurfSkills[]>(
      `SELECT s.* FROM surf_skills as s 
    INNER JOIN users_has_surf_skills as us ON s.id_surf_skill = us.id_surf_skill 
    WHERE us.id_user = ?`,
      [idUser]
    )
    .then(([surfSkills]) => surfSkills);
};

const findOneById = (idSurfSkill: number) => {
  return db
    .query<ISurfSkills[]>(`SELECT * FROM surf_skills WHERE id_surf_skill = ?`, [
      idSurfSkill,
    ])
    .then(([surfSkill]) => surfSkill[0]);
};

const create = (idUser: number, idSurfSkill: number) => {
  return connection
    .promise()
    .query<ISurfSkills[]>(
      'INSERT INTO users_has_surf_skills (id_user, id_surf_skill) VALUES (?,?)',
      [idUser, idSurfSkill]
    )
    .then(([surfSkillByUser]) => surfSkillByUser);
};

const destroyAll = (idUser: number) => {
  return connection
    .promise()
    .query<ISurfSkills[]>(
      'DELETE FROM users_has_surf_skills WHERE id_user = ?',
      [idUser]
    );
};

const SurfSkills = {
  findAll,
  findOneById,
  findOneByUser,
  create,
  destroyAll,
};

export default SurfSkills;
