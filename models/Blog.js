var mongoose = require('mongoose');
//CREATE BLOG MODEL
const blogSchema = new mongoose.Schema({
    Title : String,
    Image : String,
    Body : String,
    Created : {type: Date ,default:Date.now},
    Author : {
        id : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "user"

        },
        username : String
    }
});
//CREATE Blog MODEL

 

module.exports = new mongoose.model('blog',blogSchema);