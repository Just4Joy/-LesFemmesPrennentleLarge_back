import connection from '../helpers/db-config';
import ISessionhasweather from '../interfaces/ISessionhasWeather';



const getWeatherBySession = (id_session: ISessionhasweather['id_session']) => {
   return connection.promise().query<ISessionhasweather[]>('SELECT * FROM sessions_has_weather WHERE id_session = ?',[id_session])
   .then(([result]) => result)
}

const create = (id_session: ISessionhasweather['id_session'], id_weather: ISessionhasweather['id_weather']) => {
    return connection.promise().query<ISessionhasweather[]>('INSERT INTO sessions_has_weather (id_session, id_weather) VALUES (?,?)',[id_session, id_weather])
    .then(([result]) => result)
}

const destroy =  (id_user: ISessionhasweather['id_user'], id_weather: ISessionhasweather['id_surf_skill']) => {
    return connection.promise().query<ISessionhasweather[]>('DELETE FROM sessions_has_weather WHERE id_session = ? AND id_weather = ?',[id_user, id_weather])
}

const sessionHasWeather = {
    getWeatherBySession,
    create,
    destroy
  };
  
  export default sessionHasWeather