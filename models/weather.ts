import IWeather from '../interfaces/IWeather';
import connection from '../helpers/db-config';
import session from './session';

const db = connection.promise();

const findWeather = () => {
  const sql = `SELECT * FROM weather`;
  return db.query<IWeather[]>(sql).then(([results]) => results);
};

const getWeatherBySession = (id_session: number) => {
  return connection
    .promise()
    .query<IWeather[]>(
      'SELECT w.* FROM weather as w INNER JOIN sessions_has_weather as s ON w.id_weather = s.id_weather WHERE s.id_session = ?',
      [id_session]
    )
    .then(([result]) => result);
};

const create = (id_session: number, id_weather: number) => {
  return connection
    .promise()
    .query<IWeather[]>(
      'INSERT INTO sessions_has_weather (id_session, id_weather) VALUES (?,?)',
      [id_session, id_weather]
    )
    .then(([result]) => result);
};

const destroy = (id_user: number, id_weather: number) => {
  return connection
    .promise()
    .query<IWeather[]>(
      'DELETE FROM sessions_has_weather WHERE id_session = ? AND id_weather = ?',
      [id_user, id_weather]
    );
};

const Weather = {
  findWeather,
  getWeatherBySession,
  create,
  destroy,
};

export default Weather;
