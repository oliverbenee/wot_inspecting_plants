'use strict'
const path = require('path')
const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const Tempandhums = require('../db/db').Tempandhums
const tempandhumsData = require('./sensor')

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

app.use((request, response, next) => {
  console.log(request.url)
  next()
})

app.use(express.static(path.join(__dirname, '../public')))

/* Retrieves the state of the resource */
app.get('/', (request, response, next) => {
  response.redirect('/home')
})

app.get('/home', (request, response, next) => {
  response.render('home')
})

/** 
 * AL KODE FØR DETTE I INDEX.JS ER OK!!!!! 
*/

/* Creates a new resource and throws an error message if there is one. */
app.post('/home', (request, response, next) => {
  // tilføjede read() her d. 13/8-2019 klokken 16:23 - HJALP IKKE
  // read();
  const tempandhums = {
    temperature: 65.2,
    humidity: 10.6,
    worker_name: request.body.worker_name,
    state: request.body.state,
    workers_assessment: request.body.workers_assessment
      // fandt temperature og humidity således d. 13/8-2019 klokken 10:30
      // temperature: sensor.tempandhumsData.temperature,
      // humidity: sensor.tempandhumsData.humidity,
    
      // fandt temperature og humidity således d. 13/8-2019 klokken 10:59
      // temperature: 65.2,         // Burde lige nu kræve den rigtige?
      // humidity: 10.6,           // Burde lige nu kræve den rigtige?

      // fandt temperature og humidity således d. 13/8-2019 klokken 14:38
      // temperature: 65.2,
      // humidity: 10.6,
      // worker_name: 'mynameisjeff',
      // state: 2,
      //workers_assessment: 'the plant looks good'

      // Commit d. 13/08-2019 klokken 12:46 fandt temp/hum således:
      // const tempandhums = {
      //   temperature: Tempandhums.tempandhumsData.temperature,     //Tempandhums.tempandhumsData.temperature
      //   humidity: Tempandhums.tempandhumsdata.humidity,           //Tempandhums.tempandhumsData.humidity
      //   temperature: sensor.tempandhumsData.temperature,          //Tempandhums.tempandhumsData.temperature
      //   humidity: sensor.tempandhumsdata.humidity,                //Tempandhums.tempandhumsData.humidity
      //   worker_name: 'mynameisjeff',                              //request.body.worker_name,
      //   state: 2,                                                 //request.body.state,
      //   workers_assessment: 'the plant looks good'                //request.body.workers_assessment
      // };
  

      // fandt temperature og humidity således d. 13/8-2019 klokken 14:46
      // temperature: sensor.tempandhumsData.temperature,
      // humidity: sensor.tempandhumsdata.humidity,
      // worker_name: 'mynameisjeff',
      // state: 2,
      // workers_assessment: 'the plant looks pretty good'

      // en forrig commit fandt temperature og humidity således: ----  9485f981 d. 13/8-2019 klokken 14:43
      // temperature: Tempandhums.tempandhumsData.temperature,     //Tempandhums.tempandhumsData.temperature
      // humidity: Tempandhums.tempandhumsdata.humidity,           //Tempandhums.tempandhumsData.humidity
      // worker_name: 'mynameisjeff',                              //request.body.worker_name,
      // state: 2,                                                 //request.body.state,
      // workers_assessment: 'the plant looks good'  
  };
  Tempandhums.insert(tempandhums, err => {
    if (err) {
      response.render('data', {
        // tilføjet 10:33 d. 13/8-2019. Lod ikke til at give det rigtige.
        temperature: tempandhums.temperature,
        humidity: tempandhums.humidity,
        // slut relevans til 10:33 d. 13/8-2019.
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
