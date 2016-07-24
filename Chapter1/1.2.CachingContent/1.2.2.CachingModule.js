var fs = require("fs")

module.exports = {
	cache: {},
	readCache: function(f, cb) {

		fs.stat(f, function(err, stats){
			if(err) {
				return console.log("Error: " + err)
			}

			var lastChanged = Date.parse(stats.ctime)
			var isUpdated = (this.cache[f]) && lastChanged > this.cache[f].timestamp

			if(!this.cache[f] || isUpdated) {
				fs.readFile(f, function(err, data){
					console.log("Reading " + f + " from file")
					if(!err) {
						this.cache[f] = {
							content: data,
							timestamp: Date.now()
						}
					}
					cb(err, data)
				}.bind(this))

				return
			}

			//Otherwise, read from cache
			console.log("Loading " + f + " from cache")
			cb(null, this.cache[f].content)

		}.bind(this))
	}
}