const mysql = require('mysql')
const moment = require('moment')

const pool = mysql.createPool({
  user: 'pi',
  password: 'foobar',
  database: 'itwot'
})

/* Creates a table called tempandhums if it doesn't exist in our database  */
    // Forces temperature and humidity to be 0.0 per default if no other value is specified. from 10.55am aug-13-2019
    // Fungerede ikke med at have state VARCHAR(20). from 2.33 pm aug-13-2019 
pool.getConnection((err, connection) => {
  if (err) throw err
  connection.query(
    `CREATE TABLE IF NOT EXISTS tempandhums
      (temperature FLOAT(4,2) NOT NULL, humidity FLOAT(4,2) NOT NULL, time TIMESTAMP DEFAULT CURRENT_TIMESTAMP PRIMARY KEY)`, (err) => {
      if (err) throw err
    })
  connection.release()
})

/* Selects all from the tempandhums table in reverse cronological order and has limit on 10 */
class Tempandhums {
  static all (callback) {
    pool.getConnection((err, connection) => {
      if (err) throw err
      connection.query('SELECT * FROM tempandhums ORDER BY time DESC LIMIT 10', (err, results, fields) => {
        callback(err, results)
        connection.release()
      })
    })
  }

  /* Selects all from the tempandhums table in reverse cronological order and has limit on 1 */
  static getLChart (callback) {
    pool.getConnection((err, connection) => {
      if (err) throw err
      connection.query('SELECT * FROM tempandhums ORDER BY time DESC LIMIT 1', (err, results, fields) => {
        callback(err, results)
        connection.release()
      })
    })
  }

  /* Selects all from the tempandhums table in reverse cronological order and has limit on 5 */
  static getLTable (callback) {
    pool.getConnection((err, connection) => {
      if (err) throw err
      connection.query('SELECT * FROM tempandhums ORDER BY time DESC LIMIT 5', (err, results, fields) => {
        callback(err, results)
        connection.release()
      })
    })
  }

  /* Creates a function, where we can insert our measurements. If certain attributes contain no information, an error mesasage is produced. */
  static insert (tah) {
    // Previously used callback as paramater, but that has been removed. 
    if (!tah.worker_name) {
      return callback(new Error('Please type in a name.'))
    }
    if (!tah.workers_assessment) {
      return callback(new Error('Please specify the state.'))
    }
    pool.getConnection((err, connection) => {
      if (err) throw err
      // FØR COMMIT AUGUST 13, 2019 klokken 14:41 - brugte '' i stedet for backticks.
      // commit d. 13. august 2019 klokken 13:50 brugte '' rundt om worker_name
      const sql = 'INSERT INTO tempandhums(temperature, humidity) VALUES (?, ?)'
      connection.query(sql, [tah.temperature, tah.humidity /**, tah.worker_name, tah.state, tah.workers_assessment*/], (err, results, fields) => {
        if (err) throw err
        connection.release()
      })
    })
  }

  /* Creates a function, where we request our mesuarments */
  static request (date, callback) {
    let requestM = moment(date).format('YYYY-MM-DD HH:mm:ss')
    pool.getConnection((err, connection) => {
      if (err) throw err
      connection.query('SELECT * FROM tempandhums WHERE time >= ?', [requestM], (err, results, fields) => {
        callback(err, results)
        connection.release()
      })
    })
  }
}

module.exports = pool
module.exports.Tempandhums = Tempandhums
