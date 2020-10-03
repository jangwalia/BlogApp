require('dotenv').config();
var express         = require('express');
var port            = process.env.PORT || 3000;
var app             = express();
var flash           = require('connect-flash');
var mongoose        = require('mongoose');
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');
var flash           = require('connect-flash');
var Blog            = require('./models/Blog');
var User            = require('./models/User');
var passport        = require('passport');
var localStrategy   = require('passport-local');
var blogRoute       = require('./routes/blogs');
var indexRoute      = require('./routes/index');
const { session }   = require('passport');
app.set('view engine','ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(require('express-session')({
    secret : "this is Blog Project",
    resave : false,
    saveUninitialized : false
}));
app.use(flash());
//passport configuration
app.use(require("express-session")({
    secret : "This is the blog site",
    resave : false,
    saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//MIDDLEWARE TO SEND ERROR AND SUCCESS MESSAGE TO EVERY ROUTE
app.use((req,res,next)=>{
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.currentUser = req.user;
    next();
})
//TELLING app TO USE ALL THE ROUTES
app.use(blogRoute);
app.use(indexRoute);
//DATABASE SETUP
mongoose.connect( process.env.MONGODB_URI ||  'mongodb://localhost/JBlogs',{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log('connected to db');
}).catch(err=>{
    console.log(err.message);
});


//SERVER CODE
app.listen(port,()=>{
    console.log('The server is running');
})
