var http = require("http")
var url = require("url")
var path = require("path")
var fs = require("fs")

//The right way to do this is with a path.normalize call
http.createServer(function(req, res){
	var lookup = url.parse(decodeURI(req.url)).pathname
	lookup = path.normalize(lookup)
	lookup = (lookup === "/") ? "/index.html" : lookup
	

	var file = "wwwroot" + lookup
	console.log("Reading from " + file)

	fs.exists(file, function(exists){
		if(exists) {
			fs.readFile(file, function(err, data){
				res.end(data)
			})
			return
		}

		//Else, 404
		res.writeHead(400)
		res.end()
	})
}).listen(8080)

console.log("listening on port 8080")