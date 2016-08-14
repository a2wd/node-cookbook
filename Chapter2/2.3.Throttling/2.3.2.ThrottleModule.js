//Throttle Module
//Expects a download object with a kbps property indicating the transfer speed
module.exports = function (download, cb) {
	var chunkOutSize = download.kbps * 1024
	var timer = 0

	;(function loop(bytesSent){
		var remainingOffset
		if(!download.aborted) {
			setTimeout(function(){
				var bytesOut = bytesSent + chunkOutSize
				if(download.bufferOffset > bytesOut) {
					timer = 1000
					cb(download.chunks.slice(bytesSent, bytesOut))
					loop(bytesOut)
					return
				}

				if(bytesOut >= download.chunks.length) {
					remainingOffset = download.chunks.length - bytesSent
					cb(download.chunks.slice(remainingOffset, bytesSent))
					return
				}

				//Continue to loop, wait for enough data
				loop(bytesSent)
			}, timer)	
		}
	}(0))

	//Return function to handle abort scenario
	return function() {
		download.aborted = true
		console.log("Download aborted")
	}
}