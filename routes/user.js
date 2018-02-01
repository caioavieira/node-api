const controller = require('../controllers/userController')
const config = require('../config')

module.exports = function init(express) {
  const routes = express.Router()

  routes.route('/')
    .post(controller.createUser)
    .get(config.verifyToken, controller.getUsers)

  routes.route('/me')
    .get(controller.getTokenData)

  return routes
}
