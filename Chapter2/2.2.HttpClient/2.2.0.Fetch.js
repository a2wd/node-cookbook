var http = require("http")
var url = require("url")

var urlOpts = {
	host: "a2wd.com",
	path: "",
	port: "80"
}

if(process.argv[2]) {
	if(!process.argv[2].match("http://")) {
		process.argv[2] = "http://" + process.argv[2]
	}
	urlOpts = url.parse(process.argv[2])
}

http.get(urlOpts, function(res){
	res.on("data", function(chunk){
		console.log(chunk.toString())
	}).on("error", function(e){
		console.warn("Error: " + e.message)
	})
})