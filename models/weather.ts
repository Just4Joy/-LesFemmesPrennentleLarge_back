import IWeather from '../interfaces/IWeather';
import connection from '../helpers/db-config';

const db = connection.promise();

const findAll = () => {
  const sql = `SELECT * FROM weather`;
  return db.query<IWeather[]>(sql).then(([weather]) => weather);
};

const findOneBySession = (idSession: number) => {
  return connection
    .promise()
    .query<IWeather[]>(
      'SELECT w.* FROM weather as w INNER JOIN sessions_has_weather as s ON w.id_weather = s.id_weather WHERE s.id_session = ?',
      [idSession]
    )
    .then(([weather]) => weather);
};

const create = (idSession: number, idWeather: number) => {
  return connection
    .promise()
    .query<IWeather[]>(
      'INSERT INTO sessions_has_weather (id_session, id_weather) VALUES (?,?)',
      [idSession, idWeather]
    )
    .then(([weatherOfSession]) => weatherOfSession);
};

const destroy = (idSession: number, idWeather: number) => {
  return connection
    .promise()
    .query<IWeather[]>(
      'DELETE FROM sessions_has_weather WHERE id_session = ? AND id_weather = ?',
      [idSession, idWeather]
    );
};

const Weather = {
  findAll,
  findOneBySession,
  create,
  destroy,
};

export default Weather;
