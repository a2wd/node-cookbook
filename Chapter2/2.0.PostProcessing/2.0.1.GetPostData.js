var http = require("http")
var querystring = require("querystring")
var util = require("util")

var maxData =  2 * 1024 * 1024 // 2mb in bytes
var form = require("fs").readFileSync("wwwroot/form.html")

http.createServer(function(req, res){
	if(req.method === "GET") {
		res.writeHead(200, {"Content-Type": "text/html"})
		res.end(form)
	}
	if(req.method === "POST") {
		var postData = ""
		req.on("data", function(chunk){
			postData += chunk

			//Prevent a buffer overflow
			if(postData.length > maxData) {
				postData = ""
				this.destroy()
				res.writeHead(413)
				res.end("Too much post data")
			}
		}).on("end", function(){
			//Handle empty posts
			if(!postData) {
				res.end("No data received")
				return
			}

			//The querystring module can parse query strings
			var postDataObject = querystring.parse(postData)

			console.log("User posted:\n" + postData)

			var responseText = "[chunked post data] You posted:\n" + postData

			//util.inspect can be used to print data from an object
			responseText += "\n[querystring] You posted:\n" + util.inspect(postDataObject)
			res.end(responseText)
		})
	}
}).listen(8080)

console.log("Listening on port 8080")