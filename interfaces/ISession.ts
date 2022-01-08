import { RowDataPacket } from 'mysql2';

export default interface ISession extends RowDataPacket {
  name: string;
  date: string;
  spot_name: string;
  adress: string;
  nb_hiki_max: number;
  id_departement: number;
  id_surf_style: number;
  carpool:number;
}
