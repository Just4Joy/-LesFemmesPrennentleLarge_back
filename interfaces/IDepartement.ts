import { RowDataPacket } from 'mysql2';

export default interface IDepartement extends RowDataPacket {
  id_departement: number;
  name: string;
  id_region: number;
  departement_number: number;
}
