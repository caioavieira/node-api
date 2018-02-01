const jwt = require('jsonwebtoken')

function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function verifyToken(req, res, next) {
  let token = req.headers['Authorization'] || req.headers['authorization']
  if (!token) return res.status(403).json({auth: false, error: 'Não foi passado um token.'})

  if (!token.includes('Bearer ')) return res.status(500).json({auth: false, error: 'Token não autenticado.'})
  token = token.replace('Bearer ', '')

  jwt.verify(token, module.exports.secret, (err, decoded) => {
    if (err) return res.status(500).json({auth: false, error: 'Token não autenticado.'})

    req.decoded = decoded
    next()
  })
}

module.exports = {
  secret: 'supersecret',
  mysqlConfig: {
    host: 'localhost',
    user: 'root',
    password: 'secret',
    database: 'test'
  },
  validateEmail,
  verifyToken
}