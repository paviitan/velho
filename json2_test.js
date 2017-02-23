// secrets for API keys and such
var secrets = require('./.gitignore/secrets.json')
var FeatureCollection = {"type":"FeatureCollection","features":[]}
var fs = require('fs')
//prototype for feature
var feature = {
	"type":"Feature",
	"geometry":{"type":"Point", "coordinates":[0,0]},
	"properties":{"temperature": 0},
	"id": 0
	}
	
var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://169.50.27.27')
var topics = ['devices/1','devices/20','devices/100']

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

	var my_message = JSON.parse(message)
	//id to base10
	my_message.id = parseInt(my_message.id,16)
	console.log("Datapoint: ", my_message.id, "Temperature: ", my_message.temperature, " ºC")
	// build feature and push to collection
	feature.id = my_message.id
	feature.properties.temperature = my_message.temperature
	feature.geometry.coordinates[0] = my_message.longitude
	feature.geometry.coordinates[1] = my_message.latitude
	FeatureCollection.features.push(feature)
	client.end()
  if (topics.length == FeatureCollection.features.length){
	//export to json file if all topics are gathered
	console.log(FeatureCollection)
	var json = JSON.stringify(FeatureCollection)
	fs.writeFile('geo.json', json, 'utf8')
}
})



