var http = require("http")
var fs = require("fs")
var throttle = require("./2.3.2.ThrottleModule.js")

var options = {}
options.file = "50meg"
options.fileSize = fs.statSync(options.file).size
options.kbps = 32

http.createServer(function(req, res){
	var download = JSON.parse(JSON.stringify(options))
	download.chunks = new Buffer(download.fileSize)
	download.bufferOffset = 0

	res.writeHeader(200, {"Content-Length": options.fileSize})

	fs.createReadStream(options.file).on("data", function(chunk){
		chunk.copy(download.chunks, download.bufferOffset)
		download.bufferOffset += chunk.length
	}).once("open", function(){
		var handleAbort = throttle(download, function(send){
			res.write(send)
		})

		req.on("close", function(){
			handleAbort()
		})
	})
}).listen(8080)

console.log("Listening on port 8080")