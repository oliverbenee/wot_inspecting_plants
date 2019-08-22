const mysql = require('mysql')
const moment = require('moment')

const pool = mysql.createPool({
  user: 'pi',
  password: 'foobar',
  database: 'itwot'
})

/* Creates a table called inspections if it doesn't exist in our database  */
pool.getConnection((err, connection) => {
  if (err) throw err
  connection.query(
    `CREATE TABLE IF NOT EXISTS dhtdata
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
   connection.query(
    `CREATE TABLE IF NOT EXISTS thnow
      ( time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        temperaturenow FLOAT(4,2) NOT NULL DEFAULT 69,
        humiditynow FLOAT(4,2) NOT NULL DEFAULT 52
        )`, (err) => {
      if (err) throw err
    })
  connection.release()
})

/* Selects all from the table in reverse chronological order and has limit on 10 */
class Dhtdata {
  static all(callback) {
    pool.getConnection((err, connection) => {
      if (err) throw err
      connection.query('SELECT * FROM dhtdata JOIN workers ON dhtdata.time=workers.time ORDER BY dhtdata.time DESC LIMIT 10', (err, results, fields) => {
        callback(err, results)
        connection.release()
      })
    })
  }

  /* Selects all from the table in reverse chronological order and has limit on 1 */
  static getLChart(callback) {
    pool.getConnection((err, connection) => {
      if (err) throw err
      connection.query('SELECT * FROM dhtdata JOIN workers ON dhtdata.time=workers.time ORDER BY dhtdata.time DESC LIMIT 1', (err, results, fields) => {
        callback(err, results)
        connection.release()
      })
    })
  }

  /* Selects all from the table in reverse chronological order and has limit on 5 */
  static getLTable(callback) {
    pool.getConnection((err, connection) => {
      if (err) throw err
      connection.query('SELECT * FROM dhtdata JOIN workers ON dhtdata.time=workers.time ORDER BY dhtdata.time DESC', (err, results, fields) => {
        callback(err, results)
        connection.release()
      })
    })
  }

  /* Creates a function, where we can insert our measurements. If certain attributes contain no information, an error mesasage is produced. */
  static insert(tah, callback) { 
    pool.getConnection((err, connection) => {
      if (err) throw err
      const sql = 'INSERT INTO dhtdata(temperature, humidity) VALUES (?, ?)'
      connection.query(sql, [tah.temperature, tah.humidity], (err, results, fields) => {
        if (err) throw err
        connection.release()
      })
      console.log('Temperature and humidity was recorded.')
    })
  }
}

class Workers {
  /* Selects all from workers in reverse chronological order and has limit on 10 */
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
    if (!worker.worker_name) {
      return callback(new Error('Please type in a name.'))
    }
    if (!worker.workers_assessment) {
      return callback(new Error('Please assess the plant.'))
    }
    if (!worker.state) {
      return callback(new Error('Please specify the plant´s state.'))
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

class Thnow {
    /* Selects all from the table in reverse chronological order and has limit on 1 */
  static now(callback) {
    pool.getConnection((err, connection) => {
      if (err) throw err
      connection.query('SELECT time, temperaturenow, humiditynow FROM thnow ORDER BY time DESC LIMIT 1', (err, results, fields) => {
        callback(err, results)
        connection.release()
      })
    })
    console.log('table values fetched')
  }
  /* Creates a function, where we can insert our measurements. If certain attributes contain no information, an error mesasage is produced. */
  static insert(tah, callback) { 
    pool.getConnection((err, connection) => {
      if (err) throw err
      const sql = 'INSERT INTO thnow(temperaturenow, humiditynow) VALUES (?, ?)'
      connection.query(sql, [tah.temperature, tah.humidity], (err, results, fields) => {
        if (err) throw err
        connection.release()
      })
    })
    console.log('thnow data is stored!')
  }
}

module.exports = pool
module.exports.Dhtdata = Dhtdata
module.exports.Workers = Workers
module.exports.Thnow = Thnow