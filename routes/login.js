const controller = require('../controllers/loginController')

module.exports = function init(express) {
  const routes = express.Router()

  routes.route('/').post(controller.logIn)

  return routes
}
