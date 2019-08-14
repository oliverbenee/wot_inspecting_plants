'use strict'
/**
 * All necessary packages will be imported:
 */

//  Import needed package for the DHT sensor to function properly.
const sensorTH = require('node-dht-sensor')
//  Import needed package for GPIO to allow blinking LEDs. 
const Gpio = require('onoff').Gpio

/**
 * Set pins and functionality of sensors.
 */

//  The DHT sensor has the model number 11, and is connected to GPIO pin 12 on our Raspberry Pi.
sensorTH.initialize(11, 12)
//  The LED added to our Raspberry Pi, and is connected to GPIO pin 4 on our Raspberry Pi.
const led = new Gpio(4, 'out')

/*
  Reads sensor values. Readout contains two values:
    - temperature
    - humidity
  
  Temperature and humidity is stored as a constant "tempandhumsData".
  Values are printed to the terminal to be read.
  For confirmation, an LED connected to the RPI blinks twice. This LED is connected to pin 4.
*/

exports.read = function read() {
  //  read the sensor values
  let readout = sensorTH.read()
  //  readout contains two values: temperature and humidity, which will be used
  const tempandhumsData = {
    temperature: readout.temperature.toFixed(2),
    humidity: readout.humidity.toFixed(2)
  };
  console.log('Temperature: ' + readout.temperature.toFixed(2) + 'C, ' +
    'humidity: ' + readout.humidity.toFixed(2) + '%')
  //  An LED on the RPI will blink twice for confirmation.
    const interval = setTimeout(() => {
      led.writeSync(1);
    }, 10000);
    const interval1 = setTimeout(() => {
      led.writeSync(0);
    }, 10000);
    const interval2 = setTimeout(() => {
      led.writeSync(1);
    }, 10000);
    const interval3 = setTimeout(() => {
      led.writeSync(0);
    }, 10000);
  console.log('LED blinks twice to signal, that data has been stored.');
  return tempandhumsData;
}

// Listen to the event triggered on CTRL+C, if it get triggered, Cleanly close the GPIO pin before exiting
process.on('SIGINT', () => {
  if (interval) {
    clearTimeout(interval);
  }
  if (interval1) {
    clearTimeout(interval1);
  }
  if (interval2) {
    clearTimeout(interval2);
  }
  if (interval3) {
    clearTimeout(interval3);
  }
  console.log('Closing program. Returning to console.')
  process.exit()
});