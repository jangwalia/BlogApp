var mongoose = require('mongoose');
//CREATE BLOG MODEL
const blogSchema = new mongoose.Schema({
    Title : String,
    Image : String,
    Body : String,
    Created : {type: Date ,default:Date.now}
});
//CREATE Blog MODEL

 

module.exports = new mongoose.model('blog',blogSchema);