// secrets for API keys and such
var secrets = require('./.gitignore/secrets.json')
var FeatureCollection = {"type":"FeatureCollection","features":[]}
var fs = require('fs')
var geofilelocation = './maps/geo.json'


//puts together feature information
function weaver (id, latitude, longitude, temperature) {
	id = parseInt(id,16)
	return feature = {
	"type":"Feature",
	"geometry":{"type":"Point", "coordinates":[longitude, latitude]},
	"properties":{"temperature": temperature},
	"id": id}
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
	console.log("Datapoint: ", my_message.id, "Temperature: ", my_message.temperature, " ºC")
	// build feature and push to collection
	var feature = weaver(my_message.id, my_message.latitude, my_message.longitude, my_message.temperature)
	FeatureCollection.features.push(feature)
	client.end()
  if (topics.length == FeatureCollection.features.length){
	//export to json file if all topics are gathered
	console.log(FeatureCollection)
	var jsonfile = JSON.stringify(FeatureCollection)
	fs.writeFile(geofilelocation, jsonfile, 'utf8')
}
})



