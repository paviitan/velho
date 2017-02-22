// secrets for API keys and such
var secrets = require('./.gitignore/secrets.json')


var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://169.50.27.27')
var topics = ['devices/1','devices/20','devices/100','devices/1000']

//populate list of topics
/*
var topics = []
for(var i = 0; i < 10; i++){topics[i] = "devices/".concat(i)}
console.log(topics.length)
*/


client.on('connect', function () {
  client.subscribe(topics)
  //client.publish('presence', 'Hello mqtt')
})
console.log("Subattu topikkeihin: ", topics.toString())
console.log("Haetaan viestejä, odota pari minuuttia...")
 

client.on('message', function (topic, message) {
	/*  id, latitude, longitude, temperature  */
	/* JSON format */
	
  // message is Buffer 
  //console.log(message.toString())
  var my_message = JSON.parse(message)
  my_message.id = parseInt(my_message.id,16)
  console.log("Datapoint: ", my_message.id, "Temperature: ", my_message.temperature, " ºC") 
  client.end()
})
