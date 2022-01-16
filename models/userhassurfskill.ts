import connection from '../helpers/db-config';
import IUserhassurfskills from '../interfaces/IUserhassurfskills';


const getSurfSkillsByUser = (id_user: IUserhassurfskills['id_user']) => {
   return connection.promise().query<IUserhassurfskills[]>('SELECT id_surf_skill FROM users_has_surf_skills WHERE id_user = ?',[id_user])
   .then(([result]) => result)
}

const create = (id_user: IUserhassurfskills['id_user'], id_surf_skill: IUserhassurfskills['id_surf_skill']) => {
    return connection.promise().query<IUserhassurfskills[]>('INSERT INTO users_has_surf_skills (id_user, id_surf_skill) VALUES (?,?)',[id_user, id_surf_skill])
    .then(([result]) => result)
}

const destroy =  (id_user: IUserhassurfskills['id_user'], id_surf_skill: IUserhassurfskills['id_surf_skill']) => {
    return connection.promise().query<IUserhassurfskills[]>('DELETE FROM users_has_surf_skills WHERE id_user = ? AND id_surf_skill = ?',[id_user, id_surf_skill])
}

const UserHasSurfSkills = {
    getSurfSkillsByUser,
    create,
    destroy
  };
  
  export default UserHasSurfSkills