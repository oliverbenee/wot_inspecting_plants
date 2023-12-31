'use strict'
const path = require('path')
const express = require('express')                // Ensure, that express is available.
const exphbs = require('express-handlebars')      // Ensure, that express-handlebars is available as a rendering engine.
const bodyParser = require('body-parser')         // Ensure, that data put in forms can be parsed in code. 
const Dhtdata = require('../db/db').Dhtdata       // Import table with dht data
const Workers = require('../db/db').Workers       // Import table with workers.
const Thnow = require('../db/db').Thnow
const sensor = require('./sensor')                //Allow sensor methods to be used.

const app = express()                             // Define app using express
const port = 3000                                 //set port for server

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
  const dhtdata = {
    temperature: thdata.temperature,
    humidity: thdata.humidity,
  };
  const workers = {
    worker_name: request.body.worker_name,
    state: request.body.state,
    workers_assessment: request.body.workers_assessment
  }
  // Show data to be sent in terminal
  console.log('---------------------------------------------------------');
  console.log('|trying to post the following data to the table:');
  console.log('|temperature: ' + dhtdata.temperature + 'C');
  console.log('|humidity: ' + dhtdata.humidity + '%');
  console.log('|worker_name: ' + workers.worker_name);
  console.log('|state: ' + workers.state);
  console.log('|workers_assessment: ' + workers.workers_assessment);
  console.log('---------------------------------------------------------');
  // use insert method from db.js to enter data into the database.
  Dhtdata.insert(dhtdata, err => {
    // if the data is not posted, render the data, so the user may try again. 
    if (err) {
      response.render('data', {
        temperature: dhtdata.temperature,
        humidity: dhtdata.humidity,
        errMessage: err.message
      });
    } 
  });
  Workers.insertworker(workers, err => {
    // if the data is not posted, render the data, so the user may try again. 
    if (err) {
      response.render('data', {
        worker_name: workers.worker_name,
        workers_assessment: workers.workers_assessment,
        state: workers.state,
        errMessage: err.message
      });
    }
    else {
      // if data is successfully sent, redirect to inspection table. 
      response.redirect('/inspection');
    }
  });
  console.log('Finished inserting data. Now redirecting to inspection page...')
  response.redirect('/inspection')
});

// If directed to /inspection, render inspection.hbs
app.get('/inspection', (request, response, next) => {
  console.log('rendering inspection page...')
  response.render('inspection', {
  })
})

// Fetch dht data for the table
app.get('/data', (request, response, next) => {
  if (request.accepts('application/json') && !request.accepts('text/html')) {
    Dhtdata.all((err, data) => {
      if (err) return next(err)
      response.contentType('application/json')
      response.end(JSON.stringify(data))
    })
  }
})

// Update table with new inspections
app.get('/dataT', (request, response, next) => {
  if (request.accepts('application/json') && !request.accepts('text/html')) {
    Dhtdata.getLTable((err, data) => {
      if (err) return next(err)
      response.contentType('application/json')
      response.end(JSON.stringify(data))
    })
  }
})

// Update table with temp and humid as is now
app.get('/dataTN', (request, response, next) => {
  if (request.accepts('application/json') && !request.accepts('text/html')) {
    console.log('fetch table for thnow')
    Thnow.now((err, data) => {
      if (err) return next(err)
      response.contentType('application/json')
      response.end(JSON.stringify(data))
    })
  }
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
})