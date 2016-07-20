var http = require("http")
var path = require("path")

var routes = [
	{route:"about", output:"This is a simple about page"},
	{route:"home", output:"<h1>Home</h1> This is the home page"},
	{route:"contact", output:function() {
		return "This is the " + this.route + " page"
	}}
]

http.createServer(function(req, res){
	var lookup = path.basename(decodeURI(req.url))

	//For each blocks IO
	routes.forEach(function(r){
		if(r.route === lookup)
		{
			res.writeHead(200, {"Content-Type":"text/html"})
			res.end(typeof r.output === "function" ? r.output() : r.output)
		}
	})

	//As the forEach blocks, res.end isn't called till after the routing
	if(!res.finished) {
		res.writeHead(404)
		res.end("Page not found")
	}
}).listen(8080)