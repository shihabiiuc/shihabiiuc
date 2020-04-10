const express = require('express')
const app = express()

app.get('/', function(req, res) {
    res.send("Wow!")
})

let port = process.env.PORT
if(port == null || port == "") {
    port = 3000
}
app.listen(port)