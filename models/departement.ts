import connection from '../helpers/db-config';
import IDepartement from '../interfaces/IDepartement';

const findAll = () => {
  return connection
    .promise()
    .query<IDepartement[]>('SELECT * FROM departments')
    .then(([departements]) => departements);
};

export default {
  findAll,
};
