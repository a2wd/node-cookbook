var http = require("http")
var formidable = require("formidable")

var form = require("fs").readFileSync("wwwroot/form.html")

http.createServer(function(req, res) {
	if(req.method === "POST") {
		var incoming = new formidable.IncomingForm()
		incoming.uploadDir = "wwwroot/uploads"
		incoming.on("file", function(field, file) {
			if(!file.size)
				return
			res.write(file.name + " received\n")
		}).on("field", function(field, value){
			res.write(field + ": " + value + "\n")
		}).on("end", function(){
			res.end("All files received")
		})
		incoming.parse(req)
	}
	if(req.method === "GET") {
		res.writeHead(200, {"Content-Type": "text/html"})
		res.end(form)
	}
}).listen(8080)

console.log("Listening on port 8080")