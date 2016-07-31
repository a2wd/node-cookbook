var connect = require("connect")
var bodyParser = require("body-parser")

var util = require("util")
var form = require("fs").readFileSync("wwwroot/form.html")

connect(connect.limit("2mb"), bodyParser(), function(req, res){
	if(req.method === "POST") {
		console.log("User posted:\n", req.body)
		res.end("You posted\n" + util.inspect(req.body))
	}
	if(req.method === "GET") {
		res.writeHead(200, {"Content-Type": "text/html"})
		res.end(form)
	}
}).listen(8080)

console.log("Listening on port 8080")