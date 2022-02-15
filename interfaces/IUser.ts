import { RowDataPacket } from 'mysql2';

export default interface IUser extends RowDataPacket {
  id_user: number;
  firstname: string;
  lastname: string;
  city: string;
  email: string;
  password: string;
  zip_code: string;
  profile_pic: string;
  id_surf_skill: number;
  favorite_spot: string;
  created_date: Date;
  id_department: number;
  id_surf_style: number;
  wahine: number;
  description: string;
  phone: number;
  admin: number;
  wahine_request:number;
}
