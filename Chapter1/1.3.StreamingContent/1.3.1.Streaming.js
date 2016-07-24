var http = require("http")
var path = require("path")
var fs = require("fs")

//Cache object for content
var cache = {
	store: {},

	maxSize: 26214400, // 25mb in bytes
	maxAge: 2 * 1000, // 1.5hrs in milliseconds

	cleanedAfter: 7200 * 1000, //2hrs in milliseconds
	cleanedAt: 0, //to track last clean()

	clean: function(now) {
		if(now - this.cleanedAfter > this.cleanedAt) {
			this.cleanedAt = now
			var that = this
			Object.keys(this.store).forEach(function(file){
				if(now > that.store[file].timestamp + that.maxAge) {
					delete that.store[file]
				}
			})
		}
	}
}

//Mimetype responses
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
			var headers = {"Content-Type": mimeTypes[path.extname(lookup)]}

			//If cached, read from the cache
			if(cache.store[file]) {
				res.writeHead(200, headers)
				res.end(cache.store[file].content)
				return
			}

			//Else, stream from file
			var s = fs.createReadStream(file).once("open", function(){
				res.writeHead(200, headers)
				this.pipe(res)
			}).once("error", function(e){
				console.log(e)
				res.writeHead(500)
				res.end("Server error :/")
			})

			fs.stat(file, function(err, stats) {
				if(stats.size < cache.maxSize){
					var bufferOffset = 0
					cache.store[file] = {
						content: new Buffer(stats.size),
						timestamp: Date.now()
					}
					s.on("data", function(chunk){
						chunk.copy(cache.store[file].content, bufferOffset)
						bufferOffset += chunk.length
					})
				}
			})
			return
		}

		//Else, return a 404
		res.writeHead(404)
		res.end("File not found :(")
	})
	cache.clean(Date.now())
}).listen(8080)

console.log("Listening on port 8080")