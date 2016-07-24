var http = require("http")
var path = require("path")
var fs = require("fs")
var caching = require("./1.2.2.CachingModule")

var mimeTypes = {
	".js": "text/javascript",
	".html": "text/html",
	".css": "text/css"
}

http.createServer(function(req, res){
	var lookup = path.basename(decodeURI(req.url)) || "index.html"
	var file = "wwwroot/" + lookup

	fs.exists(file, function(exists){
		if(exists) {
			caching.readCache(file, function(err, data){

				//Handle filesystem errors
				if(err) {
					res.writeHead(500)
					res.end("Server error :/")
					return
				}

				//Write successful response
				var headers = {"Content-Type": mimeTypes[path.extname(lookup)]}
				res.writeHead(200, headers)
				res.end(data)
			})

			return
		}

		//Else, return a 404
		res.writeHead(404)
		res.end("File not found :(")
	})

}).listen(8080)

console.log("Listening on port 8080")