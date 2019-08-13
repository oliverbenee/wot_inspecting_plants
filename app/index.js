'use strict'
const path = require('path')
const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')

/**
 * Sensor requirements
 */
//  Import temperature and humidity database
const Tempandhums = require('../db/db').Tempandhums;
//  Import the needed j package for the sensor
const sensorTH = require('node-dht-sensor');
//  11 is the model number for our sensor, 12 is the GPIO we connect to on the Pi
sensorTH.initialize(11, 12);
//  Import needed package for GPIO to function properly. 
const Gpio = require('onoff').Gpio // #A

//  An LED added to the RPI, GPIO port 4 is used.
const led = new Gpio(4, 'out');




const app = express()
const port = 3000

app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  layoutsDir: path.join(__dirname, '../views/layouts')
}))
app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, '../views'))

app.use(bodyParser.urlencoded({
  extended: true
}))

/* May not be necessary */
app.use((request, response, next) => {
  console.log(request.url)
  next()
})
/* End of may not be necessary */

app.use(express.static(path.join(__dirname, '../public')))

/* Retrieves the state of the resource */
app.get('/', (request, response, next) => {
  response.redirect('/home')
})

app.get('/home', (request, response, next) => {
  response.render('home')
})

/* Creates a new resource and throws an error message if there is one. */
app.post('/home', (request, response, next) => {
  const tempandhums = {
    temperature: readout.temperature.toFixed(2),        //Tempandhums.tempandhumsData.temperature
    humidity: readout.humidity.toFixed(2),              //Tempandhums.tempandhumsData.humidity
    worker_name: 'mynameisjeff',                        //request.body.worker_name,
    state: 2,                                           //request.body.state,
    workers_assessment: 'the plant looks good'          //request.body.workers_assessment
  };
  Tempandhums.insert(tempandhums, err => {
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
      response.redirect('/data');
    }
  });
});

app.get('/data', (request, response, next) => {
  if (request.accepts('application/json') && !request.accepts('text/html')) {
    Tempandhums.all((err, data) => {
      if (err) return next(err)
      response.contentType('application/json')
      response.end(JSON.stringify(data))
    })
  }
})

app.get('/dataC', (request, response, next) => {
  if (request.accepts('application/json') && !request.accepts('text/html')) {
    Tempandhums.getLChart((err, data) => {
      if (err) return next(err)
      response.contentType('application/json')
      response.end(JSON.stringify(data))
    })
  }
})

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

app.use((err, req, res, next) => {
  console.log(err)
  res.status(500).send(err.toString())
})

app.listen(port, (err) => {
  if (err) return console.error(`An error has occured: ${err}`)
  console.log(`Listening on http://localhost:${port}/`)
})
