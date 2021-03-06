//Sending a multipart file upload, requires a client listening on localhost:8080
var http = require("http")
var fs = require("fs")

var urlOpts = {
	host: "localhost",
	path: "/",
	port: "8080",
	method: "POST"
}

var boundary = Date.now()
urlOpts.headers = {
	"Content-Type": 'multipart/form-data;boundary="' + boundary + '"'
}

boundary = "--" + boundary
var request = http.request(urlOpts, function(res){
	res.on("data", function(chunk){
		console.log(chunk.toString())
	})
}).on("error", function(e){
	console.warn("Error: " + e.stack)
})


;(function multipartAssembler(files){
	var f = files.shift()
	var fSize = fs.statSync(f).size
	var progress = 0

	fs.createReadStream(f).once("open", function(){
		request.write(boundary + "\r\n" +
			"Content-Disposition: form-data; name='userfile' filename='" + f + "'\r\n" +
			"Content-Type: application/octet-stream\r\n" + 
			"Content-Transfer-Encoding: binary\r\n\r\n")
	}).on("data", function(chunk){
		request.write(chunk)
		progress += chunk.length
		console.log(f + ": " + Math.round((progress / fSize) * 10000)/100 + "%")
	}).on("end", function(){
		if(files.length) {
			multipartAssembler(files)
			return //early finish
		}
		request.end("\r\n" + boundary + "--\r\n\r\n\r\n")
	})
}(process.argv.splice(2, process.argv.length)))