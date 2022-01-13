import { RowDataPacket } from 'mysql2';

export default interface IDepartment extends RowDataPacket {
  id_department: number;
  department_name: string;
  id_region: number;
  departement_number: number;
}
