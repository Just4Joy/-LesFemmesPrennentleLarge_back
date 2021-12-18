import userController from '../controllers/user.controller';
import surfStyleController from '../controllers/surfstyles.controller';
import userTypeController from '../controllers/usertypes.controller';

const setupRoutes = (app: any) => {
  app.use('/api/users', userController);
  app.use('/api/surfstyle', surfStyleController);
  app.use('/api/usertype', userTypeController);
  /*  
  app.use('/api/sessions', userCtrl.userController)
  app.use('/api/region', userCtrl.userController)
  app.use('/api/departement', userCtrl.userController)
  app.use('/api/surfskill', userCtrl.userController)
  app.use('/api/weather', userCtrl.userController) */
};

export default setupRoutes;
