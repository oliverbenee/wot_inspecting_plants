const mysql = require('mysql')
const moment = require('moment')

const pool = mysql.createPool({
  user: 'pi',
  password: 'foobar',
  database: 'itwot'
})

/* Creates a table called inspections if it doesn't exist in our database  */
// Fungerede ikke med at have state VARCHAR(20). from 2.33 pm aug-13-2019 
// gør det rigtige, hvis der kun bruges temperature, humidity og time
pool.getConnection((err, connection) => {
  if (err) throw err
  connection.query(
    `CREATE TABLE IF NOT EXISTS tempandhums
      (time TIMESTAMP DEFAULT CURRENT_TIMESTAMP PRIMARY KEY, 
        temperature FLOAT(4,2) NOT NULL, 
        humidity FLOAT(4,2) NOT NULL
        )`, (err) => {
      if (err) throw err
    })
  connection.query(
    `CREATE TABLE IF NOT EXISTS workers
      (time TIMESTAMP DEFAULT CURRENT_TIMESTAMP PRIMARY KEY,
        worker_name TEXT NOT NULL,
        state TEXT NOT NULL,
        workers_assessment TEXT NOT NULL
        )`, (err) => {
      if (err) throw err
    })
  connection.release()
})

/* Selects all from the table in reverse chronological order and has limit on 10 */
class Tempandhums {
  static all(callback) {
    pool.getConnection((err, connection) => {
      if (err) throw err
      connection.query('SELECT * FROM tempandhums JOIN workers ON tempandhums.time=workers.time ORDER BY time DESC LIMIT 10', (err, results, fields) => {
        callback(err, results)
        connection.release()
      })
    })
  }

  /* Selects all from the table in reverse chronological order and has limit on 1 */
  static getLChart(callback) {
    pool.getConnection((err, connection) => {
      if (err) throw err
      connection.query('SELECT * FROM tempandhums JOIN workers ON tempandhums.time=workers.time ORDER BY time DESC LIMIT 1', (err, results, fields) => {
        callback(err, results)
        connection.release()
      })
    })
  }

  /* Selects all from the table in reverse chronological order and has limit on 5 */
  static getLTable(callback) {
    pool.getConnection((err, connection) => {
      if (err) throw err
      connection.query('SELECT * FROM tempandhums JOIN workers ON tempandhums.time=workers.time ORDER BY time DESC LIMIT 5', (err, results, fields) => {
        callback(err, results)
        connection.release()
      })
    })
  }

  /* Creates a function, where we can insert our measurements. If certain attributes contain no information, an error mesasage is produced. */
  static insert(tah, callback) { 
    pool.getConnection((err, connection) => {
      if (err) throw err
      // GØR DET RIGTIGE, HVIS DER KUN BRUGES ins.temperature og ins.humidity
      // FØR COMMIT AUGUST 13, 2019 klokken 14:41 - brugte '' i stedet for backticks.
      // commit d. 13. august 2019 klokken 13:50 brugte '' rundt om name
      const sql = 'INSERT INTO tempandhums(temperature, humidity) VALUES (?, ?)'
      connection.query(sql, [tah.temperature, tah.humidity], (err, results, fields) => {
        if (err) throw err
        // connection.release()
      })
      console.log('Temperature and humidity was recorded.')
    })
  }

  /* Creates a function, where we request our measurements */
  static request(date, callback) {
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

class Workers {
  /** Selects all from workers in reverse chronological order and has limit on 10 */
  static all(callback) {
    pool.getConnection((err, connection) => {
      if (err) throw err
      connection.query('SELECT * FROM workers ORDER BY time DESC LIMIT 10', (err, results, fields) => {
        callback(err, results)
        connection.release()
      })
    })
  }

  /* Selects all from the table in reverse chronological order and has limit on 1 */
  static getLChart(callback) {
    pool.getConnection((err, connection) => {
      if (err) throw err
      connection.query('SELECT * FROM workers ORDER BY time DESC LIMIT 1', (err, results, fields) => {
        callback(err, results)
        connection.release()
      })
    })
  }

  /* Selects all from the table in reverse chronological order and has limit on 5 */
  static getLTable(callback) {
    pool.getConnection((err, connection) => {
      if (err) throw err
      connection.query('SELECT * FROM workers ORDER BY time DESC LIMIT 5', (err, results, fields) => {
        callback(err, results)
        connection.release()
      })
    })
  }

  /* Creates a new inspector to be inserted into the database. */
  static insertworker(worker, callback) {
    // Previously used callback as paramater, but that has been removed. 
    if (!worker.worker_name) {
      return callback(new Error('Please type in a name.'))
    }
    if (!worker.workers_assessment) {
      return callback(new Error('Please assess the plant.'))
    }
    pool.getConnection((err, connection) => {
      if (err) throw err
      const sql = 'INSERT INTO workers(worker_name, state, workers_assessment) VALUES (?, ?, ?)'
      connection.query(sql, [worker.worker_name, worker.state, worker.workers_assessment], (err, results, fields) => {
        if (err) throw err
        connection.release()
      })
      console.log('Worker name, state and workers assessment was recorded.')
    })
  }
}


module.exports = pool
module.exports.Tempandhums = Tempandhums
module.exports.Workers = Workers