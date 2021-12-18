import connection from '../_utils/db-config';

const findAll = () => {
  return connection
    .promise()
    .query('SELECT * FROM region')
    .then((region: any) => region[0]);
};

const findOneById = (idRegion: number) => {
  return connection
    .promise()
    .query('SELECT * FROM region WHERE id_region = ?', [idRegion])
    .then((region: any) => region[0][0]);
};

const Region = {
  findAll,
  findOneById,
};

export default Region;
