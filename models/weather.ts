import IWeather from '../interfaces/IWeather';
import connection from '../helpers/db-config';

const db = connection.promise();

const findWeather = () => {
  const sql = `SELECT * FROM weather`;
  return db.query<IWeather[]>(sql).then(([results]) => results);
};

const Weather = {
  findWeather,
};

export default Weather;
