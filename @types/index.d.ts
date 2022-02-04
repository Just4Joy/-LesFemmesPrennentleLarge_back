import IUserInfo from '../interfaces/IUserInfo';
import IUser from '../interfaces/IUser';
declare global {
  namespace Express {
    interface Request {
      userInfo?: IUserInfo;
      record?: IUser | IAddress; // used to store deleted record to send appropriate responses to react-admin
    }
  }
}
