const healthy = require('./healthy.controller');
const userController = require('./user.controller');
/**
 *
 * @param app {Application}
 */
module.exports = (app) => {
  app.use('/', healthy);
  app.use('/user', userController);
};
