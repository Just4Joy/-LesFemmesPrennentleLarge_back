import connection from '../helpers/db-config';
import IDepartement from '../interfaces/IDepartement';

const findAll = () => {
  return connection
    .promise()
    .query<IDepartement[]>('SELECT * FROM departments')
    .then(([departements]) => departements);
};

const findDepartmentById = (id: number) => {
  return connection
    .promise()
    .query<IDepartement[]>(
      `SELECT * FROM departments WHERE id_department = ?`,
      [id]
    )
    .then(([results]) => results[0]);
};

export default {
  findAll,
  findDepartmentById,
};
