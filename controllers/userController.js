const model = require('../models/user')

function createUser(req, res) {
  model.createUser(req.body, (err, data) => {
    if (err) return res.status(err.status).json(err)
    return res.status(201).json(data)
  })
}

function getUsers(req, res) {
  model.getUsers((err, data) => {
    if (err) return res.status(err.status).json(err)
    return res.status(200).json(data)
  })
}

function getTokenData(req, res) {
  const token = req.headers['Authorization'] || req.headers['authorization']

  model.getTokenData(token, (err, data) => {
    if (err) return res.status(err.status).json(err)
    return res.status(200).json(data)
  })
}

module.exports = {
  createUser,
  getUsers,
  getTokenData
}
