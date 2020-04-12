const bcrypt = require('bcryptjs')
const usersCollection = require('../db').db().collection('users')
const validator = require('validator')
const md5 = require('md5')

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
    return new Promise(async (resolve, reject) => {
        if(this.data.username == "") {this.errors.push("Username can not be blank")}
        if(this.data.username != "" && !validator.isAlphanumeric(this.data.username)) {this.errors.push("Username can only contain letters and numbers")}
        if(this.data.username.length > 0 && this.data.username.length < 5) {this.errors.push("Username should be at least 5 characters long")}
        if(this.data.username.length > 15) {this.errors.push("Username should not exceed 15 characters")}
        if(this.data.email == "") {this.errors.push("Email can not be blank")}
        if(this.data.email.length > 0 && !validator.isEmail(this.data.email)) {this.errors.push("You must provide a valid email address")}
        if(this.data.password == "") {this.errors.push("Password can not be blank")}
        if(this.data.password.length > 0 && this.data.password.length < 8) {this.errors.push("Password must be at least 8 characters long")}
        if(this.data.password.length > 30) {this.errors.push("Password does not exceed 30 character")}
    
        // Only if username is valid only then check if it is already has taken
        if(this.data.username.length > 4 && this.data.username.length < 15 && validator.isAlphanumeric(this.data.username)){
            let usernameExists = await usersCollection.findOne({username: this.data.username})
            if(usernameExists) {this.errors.push("This username already has been taken")}
        }
        // check for email already taken
        if(validator.isEmail(this.data.email)){
            let emailExists = await usersCollection.findOne({email: this.data.email})
            if(emailExists) {this.errors.push("This email already has been taken")}
        }    
        resolve()
    })
}

User.prototype.register = function() {
    return new Promise(async (resolve, reject) => {
        this.cleanUp()
        await this.validate()
    
        if(!this.errors.length) {
            let salt = bcrypt.genSaltSync(10)
            this.data.password = bcrypt.hashSync(this.data.password, salt)
            await usersCollection.insertOne(this.data)
            this.getAvatar()
            resolve()
        }else {
            reject(this.errors)
        }
    })
}

User.prototype.login = function() {
    return new Promise((resolve, reject) => {
        this.cleanUp()
        usersCollection.findOne({username: this.data.username}).then((attemptedUser) => {
            if( attemptedUser && bcrypt.compareSync(this.data.password, attemptedUser.password) ){
                this.data = attemptedUser //it will give accees to associated email of logged in username
                this.getAvatar()
                resolve("Password successfully matched")
            }else {
                reject("Password don't matched")
            }
        }).catch(function() {
            res.send("It's not you, it's us! Please try again later")
        })
    })
}

User.prototype.getAvatar = function() {
    this.avatar = `https://gravatar.com/avatar/${md5(this.data.email)}?s=128`
}

module.exports = User