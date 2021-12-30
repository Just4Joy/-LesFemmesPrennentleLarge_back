import connection from '../_utils/db-config';

const db = connection.promise();

const findWeather = () => {
  const sql = `SELECT * FROM weather`;
  return db.query(sql).then(([results]: any) => results);
};

const Weather = {
  findWeather,
};

export default Weather;
