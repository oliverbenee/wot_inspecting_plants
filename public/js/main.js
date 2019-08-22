'use strict'
/* global fetch Handlebars */
const myTable = document.querySelector('#myTable')
const myChartCtx = document.querySelector('#myChart')
const nowdata = document.querySelector('#nowdata')
const temperature = []
const humidity = []
const time = []
const worker_name = []
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


/* Update table and chart */
fetch('/dataT', {
  method: 'get',
  headers: {
    'Accept': 'application/json'
  } }).then((response) => {
  response.json().then((data) => {
    myTable.innerHTML = Handlebars.templates.data({ dhtdata: data })
  })
})

fetch('/dataC', {
  method: 'get',
  headers: {
    'Accept': 'application/json'
  } }).then((response) => {
  response.json().then((data) => {
    updateMyChart(data)
  })
})

// Update table with current data
setInterval(() => {
  fetch('/dataTN', {
    method: 'get',
    headers: {
      'Accept': 'application/json'
    } }).then((response) => {
    response.json().then((nowdata) => {
      nowdata.innerHTML = Handlebars.templates.data({ thnow: nowdata })
    })
  })
}, 10000)

/* Create the data to be shown in the chart */
function makeMyData (data) {
  for (let c of data) {
    temperature.push(c.temperature)
    humidity.push(c.humidity)
    time.push(c.time)
    worker_name.push(c.worker_name)
    state.push(c.state)
    workers_assessment.push(c.workers_assessment)
  }
  return { temperature, humidity, time, worker_name, state, workers_assessment }
}

function updateMyChart (data) {
  for (let c of data) {
    temperature.push(c.temperature)
    humidity.push(c.humidity)
    time.push(c.time)
    worker_name.push(c.worker_name)
    state.push(c.state)
    workers_assessment.push(c.workers_assessment)
    if (temperature.length >= 10) {
      temperature.shift()
      humidity.shift()
      time.shift()
      worker_name.shift()
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
        text: 'Review past inspections',
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
            labelString: 'Temp:*Celsius, Humid: Percentage',
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