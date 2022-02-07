import connection from '../helpers/db-config';
import IDepartment from '../interfaces/IDepartment';

const findAll = () => {
  return connection
    .promise()
    .query<IDepartment[]>('SELECT * FROM departments')
    .then(([departments]) => departments);
};

const findOneById = (idDepartment: number) => {
  return connection
    .promise()
    .query<IDepartment[]>(`SELECT * FROM departments WHERE id_department = ?`, [
      idDepartment,
    ])
    .then(([department]) => department[0]);
};

export default {
  findAll,
  findOneById,
};
