import connection from '../_utils/db-config';

const findAll = () => {
  return connection
    .promise()
    .query('SELECT * FROM region')
    .then((region) => region[0]);
};

const findOneById = (id_region: number) => {
  return connection
    .promise()
    .query('SELECT * FROM region WHERE id_region = ?', [id_region])
    .then((region: any) => region[0][0]);
};

module.exports = {
  findAll,
  findOneById,
};
