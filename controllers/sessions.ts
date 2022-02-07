import { Request, Response, NextFunction, RequestHandler } from 'express';
import express from 'express';
import Session from '../models/session';
import User from '../models/user';
import ISession from '../interfaces/ISession';
import { ErrorHandler } from '../helpers/errors';
import IUser from '../interfaces/IUser';
import Weather from '../models/weather';

import { formatSortString } from '../helpers/functions';
import * as Auth from '../helpers/auth';

const sessionsController = express.Router();

sessionsController.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    const region = req.query.region as string;
    const limit = req.query.limit as string;
    const date = req.query.date as string;
    const pages = req.query.pages as string;
    const wahine = req.query.wahine as string;
    const sortBy: string = req.query.sort as string;

    try {
      const sessions: ISession[] = await Session.findAll(
        Number(region),
        Number(limit),
        date,
        Number(pages),
        Number(wahine),
        formatSortString(sortBy)
      );
      res.setHeader(
        'Content-Range',
        `users : 0-${sessions.length}/${sessions.length + 1}`
      );
      return res.status(200).json(sessions);
    } catch (err) {
      next(err);
    }
  }
);

sessionsController.get(
  '/:idSession',
  async (req: Request, res: Response, next: NextFunction) => {
    const { idSession } = req.params as ISession;
    try {
      const session: ISession = await Session.findOne(idSession);
      return res.status(200).json(session);
    } catch (err) {
      next(err);
    }
  }
);

sessionsController.post(
  '/',
  Session.validateSession,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = req.body as ISession;

      const insertId: number = await Session.create(session);
      console.log(insertId);
      return res.status(200).json({ id_session: insertId, ...req.body });
    } catch (err) {
      next(err);
    }
  }
);

sessionsController.put(
  '/:idSession',
  Auth.getCurrentSession,
  Auth.checkSessionPrivileges,
  Session.validateSession,
  Session.sessionExists,
  (req: Request, res: Response, next: NextFunction) => {
    const session = req.body as ISession;

    const { idSession } = req.params as ISession;
    Session.update(idSession, session)
      .then((sessionUpdated) => {
        if (sessionUpdated) {
          res.status(200).json({ id: idSession, ...req.body }); // react-admin needs this response
        } else {
          throw new ErrorHandler(500, `Session cannot be updated`);
        }
      })
      .catch((err) => next(err));
  }
);

sessionsController.post(
  '/:idSession/users/:idUser',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { idSession } = req.params as ISession;
      const { idUser } = req.params as IUser;
      const userIsAlreadyInSession: boolean =
        await Session.checkIfUserHasSubscribe(idUser, idSession);

      if (!userIsAlreadyInSession) {
        const userSubscribed: boolean = await User.subscribe(idUser, idSession);

        if (userSubscribed) {
          const users = await User.findBySession(idSession);
          return res.status(200).json(users);
        }
        //Gérer le cas où ça ne marche pas
        else return res.status(422).json('NO SESSION FOUND');
      } else return res.status(422).json('USER ALREADY SUBSCRIBED');
    } catch (err) {
      next(err);
    }
  }
);

sessionsController.delete(
  '/:idSession/users/:idUser',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { idSession } = req.params as ISession;
      const { idUser } = req.params as IUser;
      const userIsAlreadyInSession: boolean =
        await Session.checkIfUserHasSubscribe(idUser, idSession);
      if (!userIsAlreadyInSession) {
        const unsubscription: any = await User.unsubscribe(idUser, idSession);
        if (unsubscription) {
          const users = await User.findBySession(idSession);
          return res.status(200).json(users);
        }
        return res.status(201).json('SUBSCRIPTION REMOVED');
      } else return res.status(404).json('RESSOURCE NOT FOUND');
    } catch (err) {
      next(err);
    }
  }
);

sessionsController.get(
  '/:idSession/users',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { idSession } = req.params as ISession;
      const session: ISession = await Session.findOne(idSession);
      if (session) {
        const users = await User.findBySession(idSession);
        return res.status(200).json(users);
      } else {
        return res.status(404).send('RESSOURCE NOT FOUND');
      }
    } catch (err) {
      next(err);
    }
  }
);

sessionsController.get(
  '/:idSession/weather',
  async (req: Request, res: Response) => {
    const { idSession } = req.params;
    const sessionWeather = await Weather.findOneBySession(
      parseInt(idSession, 10)
    );
    res.status(200).json(sessionWeather);
  }
);

sessionsController.post(
  '/:idSession/weather',
  async (req: Request, res: Response) => {
    const { idSession } = req.params;
    const { idWeather } = req.body;
    try {
      const created = await Weather.create(
        parseInt(idSession, 10),
        parseInt(idWeather, 10)
      );
      return res.status(201).json(created);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
);

sessionsController.delete(
  '/:idSession/weather/:idWeather',
  async (req: Request, res: Response) => {
    const { idSession, idWeather } = req.params;
    try {
      const deletedWeatherFromSession = await Weather.destroy(
        parseInt(idSession, 10),
        parseInt(idWeather, 10)
      );
      deletedWeatherFromSession
        ? res.status(204).json('RESSOURCE DELETED')
        : res.status(204).json('RESSOURCE DELETED');
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

sessionsController.delete(
  '/:idSession',
  Auth.getCurrentSession,
  Auth.checkSessionPrivileges,
  async (req: Request, res: Response, next: NextFunction) => {
    const { idSession } = req.params as ISession;
    try {
      const sessionFound: ISession = await Session.findOne(idSession);
      if (sessionFound) {
        const deletedSession = await Session.destroy(idSession);
        if (deletedSession) {
          return res.status(200).send(sessionFound);
        }
      }
    } catch (err) {
      next(err);
    }
  }
);

export default sessionsController;
