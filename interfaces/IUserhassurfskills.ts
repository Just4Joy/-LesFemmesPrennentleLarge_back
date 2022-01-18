import { RowDataPacket } from 'mysql2';
import IUser from './IUser';
import ISurfSkill from './ISurfskills';

export default interface IUserhassurfskills extends RowDataPacket {
  id_user: IUser['id_user'];
  id_surf_skill: ISurfSkill['id_surf_skill'];
}
