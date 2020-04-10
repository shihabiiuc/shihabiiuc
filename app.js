const express = require('express')
const app = express()

app.get('/', function(req, res) {
    res.send("Wow!")
})
app.listen(3000)