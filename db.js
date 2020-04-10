const dotenv = require('dotenv')
dotenv.config()
const mongodb = require('mongodb')


mongodb.connect(process.env.CONNECTIONSTRING, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, client) {

    module.exports = client.db()
    const app = require('./app')

    let port = process.env.PORT
    if(port == null || port == "") {
        port = 3000
    }
   app.listen(port)
})