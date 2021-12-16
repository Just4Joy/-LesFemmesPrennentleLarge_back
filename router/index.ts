const userCtrl = require('../controllers/user.controller')



const setupRoutes = (app: any) => {
 
  app.use('/api/users', userCtrl.userController);
/*   app.use('/api/sessions', userCtrl.userController)
  app.use('/api/region', userCtrl.userController)
  app.use('/api/departement', userCtrl.userController)
  app.use('/api/surfstyle', userCtrl.userController)
  app.use('/api/usertype' , userCtrl.userController)
  app.use('/api/surfskill', userCtrl.userController)
  app.use('/api/weather', userCtrl.userController) */






};

module.exports = {
  setupRoutes,
};