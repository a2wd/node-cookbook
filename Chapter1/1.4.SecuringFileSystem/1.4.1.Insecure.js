var http = require("http")
var url = require("url")
var fs = require("fs")

//Reading the filesystem is prone to directory traversal attacks
//Such as curl -i localhost:8080/../1.4.1.Insecure.js
http.createServer(function(req, res){
	var lookup = url.parse(decodeURI(req.url)).pathname
	lookup = (lookup === "/") ? "/index.html" : lookup

	var file = "wwwroot" + lookup
	console.log("Reading from " + file)

	fs.readFile(file, function(err, data){
		res.end(data)
	})
}).listen(8080)

console.log("listening on port 8080")