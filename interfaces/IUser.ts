import { RowDataPacket } from 'mysql2';

export default interface IUser extends RowDataPacket {
  firstname: string;
  lastname: string;
  city: string;
  email: string;
  password: string;
  zipCode: string;
  profilePic: unknown;
  idSurfSkill: number;
  favoriteSpot: string;
  createdDate: Date;
  idDepartement: number;
  idSurfStyle: number;
}
