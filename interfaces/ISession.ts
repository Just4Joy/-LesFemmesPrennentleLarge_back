import { RowDataPacket } from 'mysql2';

export default interface ISession extends RowDataPacket {
  id_session: number;
  name: string;
  date: string;
  spot_name: string;
  address: string;
  nb_hiki_max: number;
  id_department: number;
  id_surf_style: number;
  carpool: number;
  id_user: number;
  display?: string;
}
