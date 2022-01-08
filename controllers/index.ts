import express from 'express';
import usersController from '../controllers/users';
import surfStylesController from '../controllers/surfstyles';
import userTypesController from '../controllers/usertypes';
import regionsController from '../controllers/regions';
import sessionsController from '../controllers/sessions';
import departementsController from '../controllers/departements';
import weatherController from './weather';
import surfskillsController from './surfskill';
import authController from './auth';

const setupRoutes = (app: express.Application) => {
  app.use('/api/users', usersController);
  app.use('/api/surfstyle', surfStylesController);
  app.use('/api/usertype', userTypesController);
  app.use('/api/regions', regionsController);
  app.use('/api/sessions', sessionsController);
  app.use('/api/departements', departementsController);
  app.use('/api/weather', weatherController);
  app.use('/api/surfskill', surfskillsController);
  app.use('/api/login', authController);
};

export default setupRoutes;
