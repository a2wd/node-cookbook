var http = require("http")
var url = require("url")

var routes = [
	{id: "1", route: "about", output: "This is a simple about page"},
	{id: "2", route: "home", output: "<h1>Home</h1> This is the home page"},
	{id: "3", route: "contact", output: function() {
		return "This is the " + this.route + " page"
	}}
]

http.createServer(function(req, res){
	var id = url.parse(decodeURI(req.url), true).query.id

	if(id) {
		routes.forEach(function(r){
			if(r.id === id)
			{
				res.writeHead(200, {"Content-Type":"text/html"})
				res.end(typeof r.output === "function" ? r.output() : r.output)
			}
		})
	}

	if(!res.finished) {
		res.writeHead(404)
		res.end("Page not found")
	}
}).listen(8080)