'use strict';
/* global fetch Handlebars */
const myTable = document.querySelector('#myTable');
const myChartCtx = document.querySelector('#myChart');
const temperature = [];
const humidity = [];
const time = [];
const worker_name = [];
const state = [];
const workers_assessment = [];

/* Fetches all the data for the chart */
fetch('/data', {
  method: 'get',
  headers: {
    'Accept': 'application/json'
  } }).then((response) => {
  response.json().then((data) => {
    makeMyChart(data);
  });
});

/* Fetches all the data for the table */
fetch('/dataT', {
  method: 'get',
  headers: {
    'Accept': 'application/json'
  } }).then((response) => {
  response.json().then((data) => {
    myTable.innerHTML = Handlebars.templates.data({ tempandhums: data });
  });
});

/* create an interval to update the table and the chart every 10 second */
setInterval(() => {
  fetch('/dataC', {
    method: 'get',
    headers: {
      'Accept': 'application/json'
    } }).then((response) => {
    response.json().then((data) => {
      updateMyChart(data);
    });
  });

  fetch('/dataT', {
    method: 'get',
    headers: {
      'Accept': 'application/json'
    } }).then((response) => {
    response.json().then((data) => {
      myTable.innerHTML = Handlebars.templates.data({ tempandhums: data });
    });
  });
}, 10000);

/* code for the table data */
function makeMyData (data) {
  for (let c of data) {
    temperature.push(c.temperature);
    humidity.push(c.humidity);
    time.push(c.time);
    worker_name.push(c.worker_name);
    state.push(c.state);
    workers_assessment.push(c.workers_assessment);
  }
  return { temperature, humidity, time, worker_name, state, workers_assessment };
}

function updateMyChart (data) {
  for (let c of data) {
    temperature.push(c.temperature);
    humidity.push(c.humidity);
    time.push(c.time);
    worker_name.push(c.worker_name);
    state.push(c.state);
    workers_assessment.push(c.workers_assessment);
    if (temperature.length >= 10) {
      temperature.shift();
      humidity.shift();
      time.shift();
    }
  }
  myChartTH.update(300);
}

/* Code for the chart */
function makeMyChart (data) {
  const myData = makeMyData(data);
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
          fontColor: 'white'
        }
      },
      title: {
        display: true,
        text: 'Updates every 10 seconds',
        fontColor: 'white'
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
            fontColor: 'white'
          },
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Time',
            fontColor: 'white'
          }
        }],
        yAxes: [{
          ticks: {
            fontColor: 'white'
          },
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Degrees and Percentages',
            fontColor: 'white'
          },
          gridLines: {
            color: 'white'
          }
        }]
      }
    }
  });
  window.myChartTH = myChart;
}
