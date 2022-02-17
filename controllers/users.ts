import express from 'express';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import User from '../models/user';
import SurfSkills from '../models/surfskill';
import IUser from '../interfaces/IUser';
import * as Auth from '../helpers/auth';
import ISurfSkill from '../interfaces/ISurfskill';
import ISession from '../interfaces/ISession';
import Session from '../models/session';
import { formatSortString } from '../helpers/functions';
import { ErrorHandler } from '../helpers/errors';
import nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport'


const userController = express.Router();

userController.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    const sortBy: string = req.query.sort as string;

    try {
      const result: IUser[] = await User.findAll(formatSortString(sortBy));
      res.setHeader(
        'Content-Range',
        `users : 0-${result.length}/${result.length + 1}`
      );
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
);

userController.get(
  '/:idUser',
  async (req: Request, res: Response, next: NextFunction) => {
    const { idUser } = req.params as IUser;
    const display = req.query.display as string;
    try {
      const user: IUser = await User.findOneById(idUser, display);

      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  }
);

userController.post(
  '/',
  User.validateUser,
  async (req: Request, res: Response) => {
    const { email } = req.body as IUser;
    const existingEmail: IUser = await User.findByEmail(email);
    if (existingEmail) {
      return res.status(400).json('BAD REQUEST: EMAIL ALREADY EXIST');
    }
    const user = req.body as IUser;
    const userCreated = await User.create(user);
    return res
      .status(200)
      .json({ id_user: userCreated[0].insertId, ...req.body });
  }
);

userController.put(
  '/:idUser',
  Auth.getCurrentSession,
  Auth.checkSessionPrivileges,
  User.validateUser,
  async (req: Omit<Request, 'body'> & { body: IUser }, res: Response) => {
    try {
      const { idUser } = req.params as IUser;
      const foundUser: IUser = await User.findOneById(idUser);

      if (foundUser) {

        const updatedUser = await User.update(req.body, idUser);
        console.log(updatedUser)
        if (updatedUser) {
          res.status(200).json({ id: idUser, ...req.body }); // react-admin needs this response
        } else {
          throw new ErrorHandler(500, `User cannot be updated`);
        }
      }
    } catch (err) {
      return res.status(404).json(err);
    }
  }
);

userController.get(
  '/:idUser/surfskills',
  async (req: Request, res: Response) => {
    try {
      const { idUser } = req.params;
      const display = req.query.display as string;
      const foundUser: IUser = await User.findOneById(
        parseInt(idUser, 10),
        display
      );

      if (foundUser) {
        const surfskills: ISurfSkill[] = await SurfSkills.findOneByUser(
          parseInt(idUser, 10)
        );
        if (surfskills) return res.status(200).json(surfskills);
        else return res.status(404).send('RESSOURCE NOT FOUND');
      }
    } catch (err) {
      console.log(err);
    }
  }
);

userController.get('/:idUser/sessions', async (req: Request, res: Response) => {
  try {
    const { idUser } = req.params;

    const foundUser: IUser = await User.findOneById(parseInt(idUser, 10));

    if (foundUser) {
      const sessions: ISession[] = await Session.findSessionsByIdUser(
        parseInt(idUser, 10)
      );
      if (sessions) return res.status(200).json(sessions);
      else return res.status(404).send('RESSOURCE NOT FOUND');
    }
  } catch (err) {
    console.log(err);
  }
});

userController.post(
  '/:idUser/surfskills/',
  async (req: Request, res: Response) => {
    const { idUser } = req.params as IUser;
    const { idSurfSkill } = req.body as ISurfSkill;
    try {
      const created = await SurfSkills.create(idUser, idSurfSkill);
      res.status(201).json(created);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

userController.delete(
  '/:idUser/surfskills/',
  async (req: Request, res: Response) => {
    const { idUser } = req.params;
    try {
      const destroyed = await SurfSkills.destroyAll(parseInt(idUser));
      res.status(204).json('RESSOURCE DELETED');
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

userController.delete(
  '/:idUser',
  Auth.getCurrentSession,
  Auth.checkSessionPrivileges,
  async (req: Request, res: Response) => {
    try {
      const { idUser } = req.params;
      const foundUser: IUser = await User.findOneById(parseInt(idUser, 10));
      if (foundUser) {
        const deletedUser = await User.destroy(parseInt(idUser, 10));
        if (deletedUser) {
          res.status(200).send(foundUser);
        }
      }
      return res.status(201).send('USER DELETED');
    } catch (err) {
      console.log(err);
    }
  }
);

userController.get('/mail/:idUser', Auth.getCurrentSession,
  async (req: Request, res: Response) => {
    const { idUser } = req.params as IUser
    let transporter = nodemailer.createTransport(smtpTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      auth: {
        user: 'LFPLL33@gmail.com',
        pass: process.env.mailpassword
      }
    }));

    let mailOptions = {
      from: 'LFPLL33@gmail.com',
      to: 'lesfemmesprennentlelarge33@gmail.com',
      subject: `L' utilisatrice ${idUser} veut devenir WAHINE`,
      text: `L' utilisatrice ${idUser} veut devenir WAHINE`
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);

        return res.status(500).send('Something went wrong')
      } else {
        console.log('Email sent: ' + info.response);
        return res.status(200).send('E-mail sent');

      }
    });
  });

export default userController;
