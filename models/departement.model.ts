import connection from '../_utils/db-config';

const findAll = () => {
  return connection
    .promise()
    .query('SELECT * FROM department')
    .then((departement: any) => departement[0]);
};

const Departement = {
  findAll,
};

export default Departement;
