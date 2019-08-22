'use strict'
/**
 * All necessary packages will be imported:
 */

//  Import needed package for the DHT sensor to function properly.
const sensor = require('node-dht-sensor')
//  Import needed package for GPIO to allow blinking LEDs. 
const Gpio = require('onoff').Gpio
//  Import the database used for temperature and humidity as is
const Thnow = require('../db/db').Thnow

/**
 * Set pins and functionality of sensors.
 */

//  The DHT sensor has the model number 11, and is connected to GPIO pin 12 on our Raspberry Pi.
sensor.initialize(11, 12)
//  The LED added to our Raspberry Pi, and is connected to GPIO pin 4 on our Raspberry Pi.
const led = new Gpio(4, 'out')

/*
  Reads sensor values. Readout contains two values:
    - temperature
    - humidity
  
  Temperature and humidity is stored as a constant "dhtData".
  Values are printed to the terminal to be read.
  For confirmation, an LED connected to the RPI blinks twice. This LED is connected to pin 4.
*/

exports.read = function read() {
  //  read the sensor values
  let readout = sensor.read()
  //  readout contains two values: temperature and humidity, which are stored in a value dhtData.
  const dhtData = {
    temperature: readout.temperature.toFixed(2),
    humidity: readout.humidity.toFixed(2)
  };
  console.log('temperature: ' + readout.temperature.toFixed(2) + 'C, ' +
    'humidity: ' + readout.humidity.toFixed(2) + '%')
  //  An LED on the RPI will blink twice for confirmation.
    setTimeout(function(){ led.writeSync(1); }, 1000);
    setTimeout(function(){ led.writeSync(0); }, 2000);
    setTimeout(function(){ led.writeSync(1); }, 3000);
    setTimeout(function(){ led.writeSync(0); }, 4000);
  console.log('LED blinks twice to signal, that data has been stored.');
  return dhtData;
}

exports.readNow = function readNow() {
  //  read the sensor values
  let readout = sensor.read()
  //  readout contains two values: temperature and humidity, which are stored in a value dhtDataNow (to avoid confusion with other values).
  const dhtDataNow = {
    temperature: readout.temperature.toFixed(2),
    humidity: readout.humidity.toFixed(2)
  };
  console.log('current temperature: ' + readout.temperature.toFixed(2) + 'C, ' +
    ' current humidity: ' + readout.humidity.toFixed(2) + '%')
  Thnow.insert(dhtDataNow)
  return dhtDataNow;
  document.getElementById('nowdata').innerHTML = dhtDataNow
}
setInterval(() => {
  this.readNow()
}, 10000)

// Listen to the event triggered on CTRL+C, if it get triggered, Cleanly close the GPIO pin before exiting
process.on('SIGINT', () => {
  console.log('Closing program. Returning to console.')
  process.exit()
});