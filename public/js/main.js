'use strict'
/* global fetch Handlebars */
const myTable = document.querySelector('#myTable')
const thnow = document.querySelector('#thnow')
const temperature = []
const humidity = []
const time = []
const worker_name = []
const state = []
const workers_assessment = []

/* Update table */
fetch('/dataT', {
  method: 'get',
  headers: {
    'Accept': 'application/json'
  } }).then((response) => {
  response.json().then((data) => {
    myTable.innerHTML = Handlebars.templates.data({ dhtdata: data })
  })
})

// Update table with current data every second
setInterval(() => {
  fetch('/dataTN', {
    method: 'get',
    headers: {
      'Accept': 'application/json'
    } }).then((response) => {
    response.json().then((nowdata) => {
      thnow.innerHTML = Handlebars.templates.data({ dhtdata: nowdata })
    })
  })
}, 1000)