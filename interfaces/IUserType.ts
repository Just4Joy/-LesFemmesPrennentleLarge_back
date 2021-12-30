import { RowDataPacket } from 'mysql2';

export default interface IUserType extends RowDataPacket {
  id_user_type: number;
  name: string;
}
