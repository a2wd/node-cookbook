var static = require("node-static")
var fileServer = new static.Server("./wwwroot")

//Another option is to use the node-static package
require("http").createServer(function(req, res){
	req.addListener("end", function(){
		fileServer.serve(req,res)
	}).resume()
}).listen(8080)