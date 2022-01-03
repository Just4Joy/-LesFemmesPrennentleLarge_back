import { RowDataPacket } from 'mysql2';

export default interface ISurfSkill extends RowDataPacket {
  id_surf_skill: number;
  name: string;
}
