import express from 'express';
import usersController from '../controllers/users';
import surfStylesController from '../controllers/surfstyles';
import userTypesController from '../controllers/usertypes';
import regionsController from '../controllers/regions';
import sessionsController from '../controllers/sessions';
import departementsController from '../controllers/departements';

const setupRoutes = (app: express.Application) => {
  app.use('/api/users', usersController);
  app.use('/api/surfstyle', surfStylesController);
  app.use('/api/usertype', userTypesController);
  app.use('/api/regions', regionsController);
  app.use('/api/sessions', sessionsController);
  app.use('/api/departements', departementsController);
  /*
  app.use('/api/surfskill', userCtrl.userController)
  app.use('/api/weather', userCtrl.userController) */
};

export default setupRoutes;
