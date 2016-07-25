var http = require("http")
var url = require("url")
var fs = require("fs")

//To prevent directory traversal attacks, we could implement a unique naming scheme
//But this would still be fallible to a poison null byte attack
//Such as curl -i localhost:8080/../1.4.1.Insecure.js%00/index.html
http.createServer(function(req, res){
	var lookup = url.parse(decodeURI(req.url)).pathname
	lookup = (lookup === "/") ? "/index.html-ps" : lookup + "-ps"

	var file = "wwwroot-pseudo-secure" + lookup
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