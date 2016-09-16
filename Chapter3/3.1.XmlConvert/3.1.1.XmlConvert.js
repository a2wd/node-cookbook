var profiles = require("./profiles")
var xml2js = require("xml2js")

var builder = new xml2js.Builder({rootName: "profiles"})
profiles = builder.buildObject(profiles)

profiles = profiles.replace(/name/g, "fullname")
console.log(profiles)

xml2js.parseString(profiles, {
	explicitArray: false,
	explicitRoot: false
}, function(err, obj){
	profiles = obj
	profiles.felix.fullname = "Felix Geisendörfer"
	console.log(profiles)
})