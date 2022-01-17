import connection from '../helpers/db-config';
import IDepartment from '../interfaces/IDepartment';

const findAll = () => {
  return connection
    .promise()
    .query<IDepartment[]>('SELECT * FROM departments')
    .then(([departments]) => departments);
};

const findDepartmentById = (id: number) => {
  return connection
    .promise()
    .query<IDepartment[]>(`SELECT * FROM departments WHERE id_department = ?`, [
      id,
    ])
    .then(([results]) => results[0]);
};

export default {
  findAll,
  findDepartmentById,
};
