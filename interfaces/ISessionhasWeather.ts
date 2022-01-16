import { RowDataPacket } from "mysql2";
import ISession from "./ISession";
import IWeather from "./IWeather";

export default interface ISessionhasweather extends RowDataPacket {
    id_session: ISession['id_session'];
    id_weather: IWeather['id_weather'];
  }