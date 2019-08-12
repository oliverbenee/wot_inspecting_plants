const mysql = require('mysql');
const moment = require('moment');

const pool = mysql.createPool({
  user: 'pi',
  password: 'foobar',
  database: 'itwot'
});

/* Creates a table called tempandhums if it doesn't exist in our database  */
pool.getConnection((err, connection) => {
  if (err) throw err
  connection.query(
    `CREATE TABLE IF NOT EXISTS tempandhums
          (temperature FLOAT(4,2), humidity FLOAT(4,2), worker_name TEXT, state INT, workers_assessment TEXT)`, (err) => {
      if (err) throw err;
    });
  connection.release();
});

/* Selects all from the tempandhums table in reverse cronological order and has limit on 10 */
class Tempandhums {
  static all (callback) {
    pool.getConnection((err, connection) => {
      if (err) throw err;
      connection.query('SELECT * FROM tempandhums ORDER BY time DESC LIMIT 10', (err, results, fields) => {
        callback(err, results);
        connection.release();
      });
    });
  }

  /* Selects all from the tempandhums table in reverse cronological order and has limit on 1 */
  static getLChart (callback) {
    pool.getConnection((err, connection) => {
      if (err) throw err;
      connection.query('SELECT * FROM tempandhums ORDER BY time DESC LIMIT 1', (err, results, fields) => {
        callback(err, results);
        connection.release();
      });
    });
  }

  /* Selects all from the tempandhums table in reverse cronological order and has limit on 5 */
  static getLTable (callback) {
    pool.getConnection((err, connection) => {
      if (err) throw err;
      connection.query('SELECT * FROM tempandhums ORDER BY time DESC LIMIT 5', (err, results, fields) => {
        callback(err, results);
        connection.release();
      });
    });
  }

  /**
   // Creats error messages if certain attributes aren't filled with the right type or filled out at all
  static create (tah, callback) {
    if (!tah.worker_name) {
      return callback(new Error('Please type in a name.'))
    }
    if (!tah.workers_assessment) {
      return callback(new Error('Please specify the state.'))
    }
    const sql = 'INSERT INTO tempandhums(temperature, humidity, worker_name, workers_assessment, state) VALUES (?, ?, ?, ?, ?)'
    pool.getConnection((err, connection) => {
      if (err) throw err;
      connection.query(sql, [tah.temperature, tah.humidity, tah.worker_name, tah.state, tah.workers_assessment], (err, results, fields) => {
        callback(err, results);
        connection.release();
      });
    });
  }
  */

  /* Creates a function, where we can insert our mesuarments */
  static insert (tah) {
    if (!tah.temperature) {
      return callback(new Error('No temperature recorded.'))
    }
    if (!tah.humidity) {
      return callback(new Error('No humidity recorded.'))
    }
    if (!tah.worker_name) {
      return callback(new Error('Please type in a name.'))
    }
    if (!tah.workers_assessment) {
      return callback(new Error('Please specify the state.'))
    }
    pool.getConnection((err, connection) => {
      if (err) throw err;
      const sql = `INSERT INTO tempandhums(temperature, humidity, worker_name, state, workers_assessment) VALUES (?, ?, ?, ?, ?)`;
      connection.query(sql, [tah.temperature, tah.humidity, tah.worker_name, tah.state, tah.workers_assessment], (err, results, fields) => {
        if (err) throw err;
        connection.release();
      });
    });
  }

  /* Creates a function, where we request our mesuarments */
  static request (date, callback) {
    let requestM = moment(date).format('YYYY-MM-DD HH:mm:ss')
    pool.getConnection((err, connection) => {
      if (err) throw err;
      connection.query('SELECT * FROM tempandhums WHERE time >= ?', [requestM], (err, results, fields) => {
        callback(err, results);
        connection.release();
      });
    });
  }
}

module.exports = pool;
module.exports.Tempandhums = Tempandhums;
