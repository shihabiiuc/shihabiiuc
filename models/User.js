const usersCollection = require('../db').collection('users')
const validator = require('validator')

let User = function(data) {
    this.data = data
    this.errors = []
}

User.prototype.cleanUp = function() {
    if(typeof(this.data.username) != "string") {this.data.username = ""}
    if(typeof(this.data.email) != "string") {this.data.email = ""}
    if(typeof(this.data.password) != "string") {this.data.password = ""}

    // Get rid of any bogus properties rather than Username, Email & Password
    this.data = {
        username: this.data.username.trim().toLowerCase(),
        email: this.data.email.trim().toLowerCase(),
        password: this.data.password
    }
}

User.prototype.validate = function() {
    if(this.data.username == "") {this.errors.push("Username can not be blank")}
    if(this.data.username != "" && !validator.isAlphanumeric(this.data.username)) {this.errors.push("Username can only contain letters and numbers")}
    if(this.data.username.length > 0 && this.data.username.length < 5) {this.errors.push("Username should be at least 5 characters long")}
    if(this.data.username.length > 10) {this.errors.push("Username should not exceed 10 characters")}
    if(this.data.email == "") {this.errors.push("Email can not be blank")}
    if(this.data.email.length > 0 && !validator.isEmail(this.data.email)) {this.errors.push("You must provide a valid email address")}
    if(this.data.password == "") {this.errors.push("Password can not be blank")}
    if(this.data.password.length > 0 && this.data.password.length < 8) {this.errors.push("Password must be at least 8 characters long")}
    if(this.data.password.length > 30) {this.errors.push("Password does not exceed 30 character")}
}

User.prototype.register = function() {
    this.cleanUp()
    this.validate()

    if(!this.errors.length) {
        usersCollection.insertOne(this.data)
    }
}

module.exports = User