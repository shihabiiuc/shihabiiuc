const postsCollection = require('../db').db().collection('posts')
const ObjectID = require('mongodb').ObjectID
const User = require('./User')

let Post = function (data, userid) {
    this.data = data
    this.errors = []
    this.userid = userid
}

Post.prototype.cleanUp = function () {
    if (typeof (this.data.title) != "string") {this.data.title = ""}
    if (typeof (this.data.description) != "string") {this.data.description = ""}

    //get rid of any bogus property
    this.data = {
        title: this.data.title.trim(),
        body: this.data.body.trim(),
        //this body is description
        createdDate: new Date(),
        author: ObjectID(this.userid)
    }
}
Post.prototype.validate = function () {
    if (this.data.title == "") {this.errors.push("Title can not be blank")}
    if (this.data.body == "") {this.errors.push("Description can not be blank")}
}

Post.prototype.create = function () {
    return new Promise( (resolve, reject) => {
        this.cleanUp()
        this.validate()
        if (!this.errors.length) {
            postsCollection.insertOne(this.data).then( () => {
                resolve()
            } ).catch( () => {
                this.errors.push("Please try again later")
                reject(this.errors)
            } )
        } else {
            reject(this.errors)
        }
    } )

}

Post.findSingleById = function (id) {
    return new Promise(async function (resolve, reject) {
        if (typeof (id) != "string" || !ObjectID.isValid(id)) {
            reject()
            return
        }
        let posts = await postsCollection.aggregate([
            {$match: {_id: new ObjectID(id)}},
            {
                $lookup: {
                    from: "users",
                    localField: "author",
                    foreignField: "_id",
                    as: "authorDocument"
                }
            },
            {
                $project: {
                    title: 1,
                    body: 1,
                    createdDate: 1,
                    author: {
                        $arrayElemAt: ["$authorDocument", 0]
                    }
                }
            }
        ]).toArray()

        // Clean up author property in each post object
        posts = posts.map(function (post) {
            post.author = {
                username: post.author.username,
                avatar: new User(post.author, true).avatar
            }
            return post
        })


        if (posts.length) {
            console.log(posts[0])
            resolve(posts[0])
        } else {
            reject()
        }
    })
}

module.exports = Post