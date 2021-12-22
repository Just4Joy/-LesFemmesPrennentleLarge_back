import connection from '../_utils/db-config';

const findMany = () => {
  const sql = 'SELECT * FROM user';
  return connection
    .promise()
    .query(sql, [])
    .then(([results]: any) => results);
};

const findByEmail = (email: string) => {
  return connection
    .promise()
    .query('SELECT * FROM user where email = ?', [email])
    .then(([results]) => results);
};

interface PayLoad {
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

const create = (payload: PayLoad) => {
  const {
    firstname,
    lastname,
    city,
    email,
    password,
    zipCode,
    profilePic,
    idSurfSkill,
    favoriteSpot,
    createdDate,
    idDepartement,
    idSurfStyle,
  } = payload;
  return connection
    .promise()
    .query(
      'INSERT INTO user (firstname, lastname, city, email, password_hash, zip_code, profile_pic, id_surf_skill, favorite_spot, created_date, id_departement, id_surf_style) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
      [
        firstname,
        lastname,
        city,
        email,
        password,
        zipCode,
        profilePic,
        idSurfSkill,
        favoriteSpot,
        createdDate,
        idDepartement,
        idSurfStyle,
      ]
    );
};

const User = {
  findMany,
  create,
  findByEmail,
};

export default User;
