import { Request, Response, NextFunction } from 'express';
import express = require('express');
import Session from '../models/session';
import ISession from '../interfaces/ISession';


const sessionsController = express.Router();

sessionsController.get('/', async (_req: Request, res: Response,  next: NextFunction) => {
  try {
    const result = await Session.findSession();
   return res.status(200).json(result)
  }
  catch(err: any) {
    next(err)
  }
  
});

sessionsController.post('/', async (req: Request, res: Response,  next: NextFunction) => {
  const session = req.body as ISession;
  const validationErrors = Session.validate(req.body);
  if (validationErrors) {
    return res.status(422).json(validationErrors);
  }
  const response: ISession[] = await Session.create(req.body);
  return res
    .status(200)
    .json({ id_session: response[0].insertId, ...req.body });
});

sessionsController.put('/:id_session', (req: Request, res: Response, next: NextFunction) => {
  let existingSession: any = null;
  let validationErrors: any = null;
  const {id_session} = req.params
  Session.findOne(req.params.id_session)
    .then((session) => {
      existingSession = session;
      if (!existingSession) return Promise.reject('RECORD_NOT_FOUND');
      validationErrors = Session.validate(req.body);
      if (validationErrors) return Promise.reject('INVALID_DATA');
      return Session.update(req.params.id_session, req.body);
    })
    .then(() => {
      res.status(200).json({ ...existingSession, ...req.body });
    })
    .catch((err) => {
      console.error(err);
      if (err === 'RECORD_NOT_FOUND')
        res.status(404).send(`Session with id ${req.params.id} not found.`);
      else if (err === 'INVALID_DATA')
        res.status(422).json({ validationErrors: validationErrors.details });
      else res.status(500).send('Error updating a session.');
    });
});

export default sessionsController;
