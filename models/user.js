const mysql = require('mysql')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const config = require('../config')

const pool = mysql.createPool(config.mysqlConfig)

function createUser(user, callback) {
  
  if (!config.validateEmail(user.email)) return callback({status: 500, error: 'Email inválido.'})
  
  user.password = bcrypt.hashSync(user.password, 8)

  const sql = 'INSERT INTO user SET ?'

  pool.getConnection((err, conn) => {
    if (err) return callback({status: 500, error: 'Não foi possível estabelecer uma conexão com o banco de dados.'})
    conn.query(sql, user, (error, results, fields) => {
      conn.release()
      if (error) return callback({status: 500, error})
      const token = jwt.sign({id: results.insertId}, config.secret, {expiresIn: 86400})
      return callback(null, {auth: true, token})
    })
  })
}

function getUsers(callback) {
  const sql = 'SELECT id, email FROM user'

  pool.getConnection((err, conn) => {
    if (err) return callback({status: 500, auth: true, error: 'Não foi possível estabelecer uma conexão com o banco de dados.'})
    conn.query(sql, (error, results, fields) => {
      conn.release()
      if (error) return callback({status: 500, auth: true, error})
      return callback(null, {auth: true, results})
    })
  })
}

function getTokenData(token, callback) {
  if (!token) return callback({status: 401, auth: false, error: 'Não foi passado um token.'})
  
  if (!token.includes('Bearer ')) return callback({status: 500, auth: false, error: 'Token não autenticado.'})
  token = token.replace('Bearer ', '')

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) return callback({status: 500, auth: false, error: 'Token não autenticado.'})
    return callback(null, {auth: true, decoded})
  })
}

module.exports = {
  createUser,
  getUsers,
  getTokenData
}
