'use strict'
const path = require('path')
const express = require('express') //Ensure, that express is available
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const Tempandhums = require('../db/db').Tempandhums
const sensor = require('./sensor') //Allow sensor methods to be used.

const app = express() // Define app using express
const port = 3000 //set port for server

// Configure app to use express-hbs to tackle viewing pages.
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  layoutsDir: path.join(__dirname, '../views/layouts')
}))
app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, '../views'))

// Configure app to use bodyParser - allows data from POST to be fetched.
app.use(bodyParser.urlencoded({
  extended: true
}))

app.use((request, response, next) => {
  console.log(request.url)
  next()
})

app.use(express.static(path.join(__dirname, '../public')))

/* 
 * Retrieves the correct page to serve
 */

// Redirect from / to /home
app.get('/', (request, response, next) => {
  response.redirect('/home')
})

// If directed to /home, render home.hbs
app.get('/home', (request, response, next) => {
  response.render('home')
})

/* Creates a new resource and throws an error message if there is one. */
app.post('/inspection', (request, response, next) => {
  const thdata = sensor.read();
  // data to be posted to server.
  const tempandhums = {
    temperature: thdata.temperature,
    humidity: thdata.humidity,
    worker_name: request.body.worker_name,
    state: request.body.state,
    workers_assessment: request.body.workers_assessment
  };
  // Show data to be sent in terminal
  console.log('---------------------------------------------------------');
  console.log('|trying to post the following data to inspection table:');
  console.log('|temperature: ' + tempandhums.temperature + 'C');
  console.log('|humidity: ' + tempandhums.humidity + '%');
  console.log('|worker_name: ' + tempandhums.worker_name);
  console.log('|state: ' + tempandhums.state);
  console.log('|workers_assessment: ' + tempandhums.workers_assessment);
  console.log('---------------------------------------------------------');
  // use insert method from db.js to enter data into the database.
  Tempandhums.insert(tempandhums, err => {
    // if the data is not posted, render the data, so the user may try again. 
    if (err) {
      response.render('data', {
        temperature: tempandhums.temperature,
        humidity: tempandhums.humidity,
        worker_name: tempandhums.worker_name,
        workers_assessment: tempandhums.workers_assessment,
        state: tempandhums.state,
        errMessage: err.message
      });
    } else {
      // if data is successfully sent, redirect to inspection table. 
      response.redirect('/inspection');
    }
  });
});

/** -- SAFEGUARDED FOR POTENTIAL LATER USE.
// If directed to /inspection, render inspection.hbs
app.get('/inspection', (request, response, next) => {
  response.render('inspection')
})
*/

app.get('/inspection', (request, response, next) => {
  Tempandhums.all((err, inspection) => {
    if (err) return next(err)
    response.render('inspection', {
      inspection: inspection
    })
  })
})

/**
 * AL KODE EFTER DETTE I INDEX.JS ER OK!!!!!
 */

app.get('/data', (request, response, next) => {
  if (request.accepts('application/json') && !request.accepts('text/html')) {
    Tempandhums.all((err, data) => {
      if (err) return next(err)
      response.contentType('application/json')
      response.end(JSON.stringify(data))
    })
  }
})

// Update chart
app.get('/dataC', (request, response, next) => {
  if (request.accepts('application/json') && !request.accepts('text/html')) {
    Tempandhums.getLChart((err, data) => {
      if (err) return next(err)
      response.contentType('application/json')
      response.end(JSON.stringify(data))
    })
  }
})

// Update chart
app.get('/dataT', (request, response, next) => {
  if (request.accepts('application/json') && !request.accepts('text/html')) {
    Tempandhums.getLTable((err, data) => {
      if (err) return next(err)
      response.contentType('application/json')
      response.end(JSON.stringify(data))
    })
  }
})

app.get('/requestM', (request, response, next) => {
  Tempandhums.request(request.query.date, (err, data) => {
    if (err) return next(err)
    response.contentType('application/json')
    response.end(JSON.stringify(data))
  })
})

// If an error is produced, send it to the console.
app.use((err, req, res, next) => {
  console.log(err)
  res.status(500).send(err.toString())
})

// Server started. Link to server is generated. Alert the user of how they can terminate the program and sensors... By producing an error...

app.listen(port, (err) => {
  if (err) return console.error(`An error has occured: ${err}`)
  console.log(`Listening on http://localhost:${port}/`)
  console.log(`This program may be closed at any time by using the key combination "CTRL + C"`)
  console.log(`Make sure to read temperature and humidity at least once before deployment.`)
})