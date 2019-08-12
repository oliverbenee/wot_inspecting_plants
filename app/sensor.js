'use strict';
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

/*
  Reads sensor values. Readout contains two values:
    - temperature
    - humidity
  
  Temperature and humidity is stored as a constant "tempandhumsData".
  Values are printed to the terminal to be read.
  For confirmation, an LED connected to the RPI blinks twice. This LED is connected to pin 4.
*/

function read () {
  //  read the sensor values
  let readout = sensorTH.read();
  //  readout contains two values: temperature and humidity, which will be used
  const tempandhumsData = {
    temperature: readout.temperature.toFixed(2),
    humidity: readout.humidity.toFixed(2),
  };
  console.log('Temperature: ' + readout.temperature.toFixed(2) + 'C, ' +
 'humidity: ' + readout.humidity.toFixed(2) + '%');
  
  //  An LED on the RPI will blink twice for confirmation.
  for (let i = 0; i <= 2; i++){
    const interval = setInterval(() => {
      led.writeSync(1);
    }, 1000);
    const interval1 = setInterval(() => {
      led.writeSync(0);
    }, 1000);
  }

  // Export temperature and humidity data
  module.exports.tempandhumsData = tempandhumsData;

  // Insert temperature and humidity data - maybe needs to be deleted.
  Tempandhums.insert(tempandhumsData);

  console.log('LED blinks twice to signal, that data has been stored.');
}



//  Listen to the event triggered on CTRL+C, if it get triggered, Cleanly close the GPIO pin before exiting
process.on('SIGINT', () => {
  clearInterval(interval);
  console.log('Bye, bye!');
  process.exit();
});

