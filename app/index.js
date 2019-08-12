'use strict'
const path = require('path')
const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const Tempandhums = require('../db/db').Tempandhums
require('./sensor')

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


/* Creates a new resource and throws an error message if there is one. */
app.post('/homePage', (request, response, next) => {
  const tempandhums = {
    temperature: tempandhumsData.temperature.temperature,
    humidity: tempandhumsData.humidity,
    worker_name: request.body.worker_name,
    state: request.body.state,
    workers_assessment: request.body.workers_assessment
  };
  Tempandhums.insert(tempandhums, err => {
    if (err) {
      response.render('data', {
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

/* Retrieves the state of the resource */
app.get('/', (request, response, next) => {
  response.redirect('/home')
})

/* Redirects from homepage to home*/
app.get('/homePage', (request, response, next) => {
  response.redirect('/home')
})

app.get('/home', (request, response, next) => {
  response.render('homePage')
})

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
