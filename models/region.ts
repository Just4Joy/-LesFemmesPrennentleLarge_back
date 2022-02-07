import connection from '../helpers/db-config';
import IRegion from '../interfaces/IRegion';

const findAll = () => {
  return connection
    .promise()
    .query<IRegion[]>('SELECT * FROM regions')
    .then(([regions]) => regions);
};

const findOneById = (idRegion: number) => {
  return connection
    .promise()
    .query<IRegion[]>('SELECT * FROM regions WHERE id_region = ?', [idRegion])
    .then(([[region]]) => region);
};

const Region = {
  findAll,
  findOneById,
};

export default Region;
