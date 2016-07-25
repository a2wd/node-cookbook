var http = require("http")
var url = require("url")
var path = require("path")
var fs = require("fs")

var whitelist = [
	"/index.html",
	"/js/scripts.js",
	"/css/main.css"
]

//For even stronger security, we could employ a whitelist
http.createServer(function(req, res){
	var lookup = url.parse(decodeURI(req.url)).pathname
	lookup = path.normalize(lookup)
	lookup = (lookup === "/") ? "/index.html" : lookup
	
	var file = "wwwroot" + lookup
	console.log("Reading from " + file)

	if(whitelist.indexOf(lookup) !== -1) {
		fs.readFile(file, function(err, data){
			res.end(data)
		})
		return
	}

	//Else, not in whitelist
	res.writeHead(400)
	res.end()

}).listen(8080)

console.log("listening on port 8080")