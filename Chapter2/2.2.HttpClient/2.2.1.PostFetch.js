//Sending post data, requires a client listening on localhost:8080
var http = require("http")
var urlOpts = {
	host: "localhost",
	path: "/",
	port: 8080,
	method: "POST"
}

var request = http.request(urlOpts, function(res) {
	res.on("data", function(chunk){
		console.log(chunk.toString())
	})
}).on("error", function(e){
	console.warn("Error: " + e.stack)
})

process.argv.forEach(function(postItem, index){
	if(index > 1) {
		request.write(postItem + "\n")
	}
})

request.end()