import { RowDataPacket } from 'mysql2';

export default interface ISurfStyle extends RowDataPacket {
  id_surf_style: number;
  name_user: string;
  name_session: string;
}
