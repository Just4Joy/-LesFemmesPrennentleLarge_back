import userController from '../controllers/user.controller';
import surfStyleController from '../controllers/surfstyles.controller';
import userTypeController from '../controllers/usertypes.controller';
import regionController from '../controllers/region.controller';
import sessionsController from '../controllers/session.controller';

const setupRoutes = (app: any) => {
  app.use('/api/users', userController);
  app.use('/api/surfstyle', surfStyleController);
  app.use('/api/usertype', userTypeController);
  app.use('/api/regions', regionController);
  app.use('/api/sessions', sessionsController);
  /*  
  app.use('/api/departement', userCtrl.userController)
  app.use('/api/surfskill', userCtrl.userController)
  app.use('/api/weather', userCtrl.userController) */
};

export default setupRoutes;
