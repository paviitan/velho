// secrets for API keys and such
var secrets = require('./.gitignore/secrets.json')
var FeatureCollection = {"type":"FeatureCollection","features":[]}
var fs = require('fs')
var geofilelocation = './maps/geo.json'


//puts together feature information
function weaver (id, latitude, longitude, temperature) {
	//ID to base10
	id = parseInt(id,16)
	// coordinates to string for properties info
	var stringCoordinates = ('lat ' + latitude.toString() + " lgn " + longitude.toString())
	return feature = {
	"type":"Feature",
	"geometry":{"type":"Point", "coordinates":[longitude, latitude]},
	"properties":{"temperature": temperature, "id":id, "coordinates":stringCoordinates},
	"id": id}
}
	
var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://169.50.27.27')

//manual topics
//var topics = ['devices/1','devices/20','devices/1000']

//populate list of topics

var topics = []
for(var i = 0; i < 100; i++){topics[i] = "devices/".concat(i+1)}

client.on('connect', function () {
  client.subscribe(topics)
  //client.publish('presence', 'Hello mqtt')
})
console.log("Subattu " + topics.length + " topikkiin.")
console.log("Haetaan viestejä, odota pari minuuttia...")

client.on('message', function (topic, message) {
	/*  id, latitude, longitude, temperature JSON format */
	var my_message = JSON.parse(message)
	//prints for debug purposes
	console.log(my_message)
	//console.log(my_message.id, my_message.latitude, my_message.longitude, my_message.temperature)
	// build GeoJSON "feature" object and push to collection
	var feature = weaver(my_message.id, my_message.latitude, my_message.longitude, my_message.temperature)
	FeatureCollection.features.push(feature)
	client.end()
})

setTimeout(function(){
	//export to json file of topics gathered within 2,5 minutes
	var jsonfile = JSON.stringify(FeatureCollection)
	fs.writeFile(geofilelocation, jsonfile, 'utf8')
	console.log('JSON filu tehty. Operaatio onnistui.')
}, 300000)

