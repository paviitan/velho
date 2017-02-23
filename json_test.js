// secrets for API keys and such
var secrets = require('./.gitignore/secrets.json')
var fs = require('fs')
var FeatureCollection = {"type":"FeatureCollection","features":[]}
//prototype for feature
var feature = {
	"type":"Feature",
	"geometry":{"type":"Point", "coordinates":[0,0]},
	"properties":{"temperature": 0.0},
	"id": 0
	}
	
var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://169.50.27.27')
var topics = ['devices/1','devices/20','devices/100']

//simulated JSON parsed message	
var my_message = {"id":2 , "longitude":36.24225, "latitude":42.75908, "temperature":25.1}
//id to base10
my_message.id = parseInt(my_message.id,16)
console.log("Datapoint: ", my_message.id, "Temperature: ", my_message.temperature, " ºC")
// build feature and push to collection
feature.id = my_message.id
feature.properties.temperature = my_message.temperature
feature.geometry.coordinates[0] = my_message.latitude
feature.geometry.coordinates[1] = my_message.longitude
FeatureCollection.features.push(feature)
// test prints
console.log(feature.geometry)
console.log(feature.properties)

//print FeatureCollection
console.log(FeatureCollection)
var json = JSON.stringify(FeatureCollection)
fs.writeFile('geo.json', json, 'utf8')



