var mongoose               = require('mongoose');
var passporrLocalMongoose  = require('passport-local-mongoose'); 
//CREATE User MODEL
const userSchema = new mongoose.Schema({
    username : String,
    password : String
});
//CREATE User MODEL
userSchema.plugin(passporrLocalMongoose);
module.exports = new mongoose.model('user',userSchema);