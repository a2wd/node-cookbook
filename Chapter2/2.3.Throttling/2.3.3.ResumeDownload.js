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

	download.readStreamOptions = {}
	download.headers = {"Content-Length": options.fileSize}
	download.statusCode = 200

	if(req.headers.range) {
		//Client connection resumes with: Range: bytes=512-1024
		//Response must reply with: Content-Range: bytes 512-1024/1024
		download.start = req.headers.range.replace("bytes=", "").split("-")[0]
		//Coerce download.start to a number
		download.readStreamOptions = {start: +download.start}
		download.headers["Content-Range"] = "bytes " + download.start + "-" + download.fileSize + "/" + download.fileSize
		//Response 206 for partial content
		download.statusCode = 206
	}

	res.writeHeader(download.statusCode, download.headers)

	fs.createReadStream(options.file, download.readStreamOptions).on("data", function(chunk){
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