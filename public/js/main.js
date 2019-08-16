'use strict'
/* global fetch Handlebars */
const myTable = document.querySelector('#myTable')
const myChartCtx = document.querySelector('#myChart')
const temperature = []
const humidity = []
const time = []
const name = []
const state = []
const workers_assessment = []

/* Fetches all the data for the chart */
fetch('/data', {
  method: 'get',
  headers: {
    'Accept': 'application/json'
  } }).then((response) => {
  response.json().then((data) => {
    makeMyChart(data)
  })
})

/* Fetches all the data for the table */
fetch('/dataT', {
  method: 'get',
  headers: {
    'Accept': 'application/json'
  } }).then((response) => {
  response.json().then((data) => {
    myTable.innerHTML = Handlebars.templates.data({ tempandhums: data })
  })
})

/* Update table and chart */
function fetchNewData() {
  fetch('/dataC', {
    method: 'get',
    headers: {
      'Accept': 'application/json'
    } }).then((response) => {
    response.json().then((data) => {
      updateMyChart(data)
    })
  })

  fetch('/dataT', {
    method: 'get',
    headers: {
      'Accept': 'application/json'
    } }).then((response) => {
    response.json().then((data) => {
      myTable.innerHTML = Handlebars.templates.data({ tempandhums: data })
    })
  })
}

/* code for the table data */
function makeMyData (data) {
  for (let c of data) {
    temperature.push(c.temperature)
    humidity.push(c.humidity)
    time.push(c.time)
    name.push(c.name)
    state.push(c.state)
    workers_assessment.push(c.workers_assessment)
  }
  return { temperature, humidity, time, name, state, workers_assessment }
}

function updateMyChart (data) {
  for (let c of data) {
    temperature.push(c.temperature)
    humidity.push(c.humidity)
    time.push(c.time)
    name.push(c.name)
    state.push(c.state)
    workers_assessment.push(c.workers_assessment)
    if (temperature.length >= 10) {
      temperature.shift()
      humidity.shift()
      time.shift()
      name.shift()
      state.shift()
      workers_assessment.shift()
    }
  }
  myChartTH.update(300) //Previously had no value
}

/* Code for the chart */
function makeMyChart (data) {
  const myData = makeMyData(data)
  const myChart = new Chart(myChartCtx, {
    type: 'line',
    data: {
      labels: myData.time,
      datasets: [{
        label: 'Temperature',
        data: myData.temperature,
        backgroundColor: 'red',
        borderColor: 'red',
        fill: false
      }, {
        label: 'Humidity',
        data: myData.humidity,
        backgroundColor: 'black',
        borderColor: 'black',
        fill: false
      }]
    },
    options: {
      responsive: true,
      responsiveAnimationDuration: 0,
      maintainAspectRatio: true,
      aspectRatio: 2,
      onResize: null,
      legend: {
        labels: {
          fontColor: 'black'
        }
      },
      title: {
        display: true,
        text: 'Review past inspections - updates when new data is posted.',
        fontColor: 'black'
      },
      tooltips: {
        mode: 'index',
        intersect: false
      },
      hover: {
        mode: 'nearest',
        intersect: true
      },
      scales: {
        xAxes: [{
          ticks: {
            fontColor: 'black'
          },
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Time',
            fontColor: 'black'
          }
        }],
        yAxes: [{
          ticks: {
            fontColor: 'black'
          },
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Degrees and Percentages',
            fontColor: 'black'
          },
          gridLines: {
            color: 'white'
          }
        }]
      }
    }
  })
  window.myChartTH = myChart
}
