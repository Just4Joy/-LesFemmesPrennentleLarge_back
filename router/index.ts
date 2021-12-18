const userCtrl = require('../controllers/user.controller');
const surfStyleCtrl = require('../controllers/surfstyles');
const userTypeCtrl = require('../controllers/usertypes');
const regionsCtrl = require('../controllers/region.controller');

const setupRoutes = (app: any) => {
  app.use('/api/users', userCtrl.userController);
  app.use('/api/surfstyle', surfStyleCtrl.surfStyleController);
  app.use('/api/usertype', userTypeCtrl.userTypeController);
  // app.use('/api/sessions', userCtrl.userController);
  app.use('/api/regions', regionsCtrl.regionController);
  // app.use('/api/departement', userCtrl.userController)
  app.use('/api/surfskill', userCtrl.userController);
  // app.use('/api/weather', userCtrl.userController);
};

module.exports = {
  setupRoutes,
};
