var http = require("http")
var fs = require("fs")

var form = require("fs").readFileSync("wwwroot/form-put.html")

http.createServer(function(req, res) {
	if(req.method === "PUT") {
		var fileData = new Buffer(+req.headers["content-length"])
		var bufferOffset = 0
		req.on("data", function(chunk){
			chunk.copy(fileData, bufferOffset)
			bufferOffset += chunk.length
		}).on("end", function(){
			var rand = (Math.random() * Math.random()).toString(16).replace(".", "")
			var to = "wwwroot/uploads/" + rand + "-" + req.headers["x-uploaded-filename"]

			fs.writeFile(to, fileData, function(err){
				if(err) {
					throw err
				}
				console.log("Saved file to " + to)
				res.end("Successfully received " + req.headers["x-uploaded-filename"])
			})
		})
	}
	if(req.method === "GET") {
		res.writeHead(200, {"Content-Type": "text/html"})
		res.end(form)
	}
}).listen(8080)

console.log("Listening on port 8080")