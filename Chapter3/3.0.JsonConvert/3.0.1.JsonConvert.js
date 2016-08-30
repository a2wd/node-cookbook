var profiles = require("./profiles.js")

//Stringify the JSON object and change name to full-name
profiles = JSON.stringify(profiles).replace(/name/g, "fullname")

//Parse the JSON string and update the felix.fullname property
profiles = JSON.parse(profiles)
profiles.felix.fullname = "Felix Geisendürfer"

console.log(profiles.felix)
