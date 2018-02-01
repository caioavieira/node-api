const model = require('../models/login')

function logIn(req, res) {
  model.logIn(req.body, (err, data) => {
    if (err) return res.status(err.status).json(err)
    return res.status(200).json(data)
  })
}

module.exports = {
  logIn
}
