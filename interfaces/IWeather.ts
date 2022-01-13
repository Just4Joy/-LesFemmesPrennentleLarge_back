import { RowDataPacket } from 'mysql2';

export default interface IWeather extends RowDataPacket {
  id_weather: number;
  name: string;
  category: string;
  type: string;
}
