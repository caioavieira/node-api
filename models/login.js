const mysql = require('mysql')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const config = require('../config')

const pool = mysql.createPool(config.mysqlConfig)

function logIn(user, callback) {
  const sql = 'SELECT id, email, password FROM user WHERE email = ?'

  pool.getConnection((err, conn) => {
    if (err) return callback({status: 500, error: 'Não foi possível estabelecer uma conexão com o banco de dados.'})
    conn.query(sql, user.email, (error, results, fields) => {
      conn.release()
      if (error) return callback({status: 500, error})

      if (results.length === 0) return callback({status: 401, auth: false, error: 'Email ou senha inválido.'})

      const passwordIsValid = bcrypt.compareSync(user.password, results[0].password)
      if (!passwordIsValid) return callback({status: 401, auth: false, error: 'Email ou senha inválido.'})

      const token = jwt.sign({id: results[0].id}, config.secret, {expiresIn: 86400})
      return callback(null, {auth: true, token})
    })
  })
}

module.exports = {
  logIn
}
