// secrets for API keys and such
var secrets = require('./.gitignore/secrets.json')
var FeatureCollection = {"type":"FeatureCollection","features":[]}
var fs = require('fs')
//prototype for feature
function weaver (id, latitude, longitude, temperature) {
	return feature = {
	"type":"Feature",
	"geometry":{"type":"Point", "coordinates":[longitude, latitude]},
	"properties":{"temperature": temperature},
	"id": id}
}
	
var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://169.50.27.27')
var topics = ['devices/1','devices/20','devices/100']


//simulate message 1 
var my_message = {"id": 1, "longitude":50.102, "latitude":50.101, "temperature":20.5}
//id to base10
my_message.id = parseInt(my_message.id,16)

var feature = weaver(my_message.id, my_message.latitude, my_message.longitude, my_message.temperature)
FeatureCollection.features.push(feature)
//simulate message 2 
var my_message = {"id": 10, "longitude":70.102, "latitude":50.101, "temperature":20.5}
//id to base10
my_message.id = parseInt(my_message.id,16)

var feature = weaver(my_message.id, my_message.latitude, my_message.longitude, my_message.temperature)
FeatureCollection.features.push(feature)
//simulate message 3
var my_message = {"id": 100, "longitude":60.102, "latitude":50.101, "temperature":20.5}
//id to base10
my_message.id = parseInt(my_message.id,16)

var feature = weaver(my_message.id, my_message.latitude, my_message.longitude, my_message.temperature)
FeatureCollection.features.push(feature)

if (topics.length == FeatureCollection.features.length){
//export to json file if all topics are gathered
console.log(FeatureCollection)
var json = JSON.stringify(FeatureCollection)
fs.writeFile('geo.json', json, 'utf8')
}



