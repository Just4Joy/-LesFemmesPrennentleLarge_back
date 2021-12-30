import connection from '../_utils/db-config';
import IDepartement from '../interfaces/IDepartement';

const findAll = () => {
  return connection
    .promise()
    .query<IDepartement[]>('SELECT * FROM departements')
    .then(([departements]) => departements);
};

export default {
  findAll,
};
