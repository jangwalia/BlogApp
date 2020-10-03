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
var localStrategy  = require('passport-local');
const { session } = require('passport');
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
//DATABASE SETUP
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/JBlogs',{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log('connected to db');
}).catch(err=>{
    console.log(err.message);
});

//HOMEPAGE ROUTE
app.get('/',(req,res)=>{
    res.render("landing");
})


//INDEX ROUTE WHICH WILL SHOW ALL BLOGS
app.get('/blogs',(req,res)=>{
    Blog.find({},(err,allBlogs)=>{
        if(err){
            console.log(err);
        }else{
            res.render('blogs/index',{blogs:allBlogs});
        }
    })
})

//NEW ROUTE WHICH WILL SHOW FORM
app.get('/blogs/new',Isloggedin,(req,res)=>{
    res.render('blogs/form');
})
// CREATE ROUTE TO CREATE NEW BLOG
app.post('/blogs',Isloggedin,(req,res)=>{
    Blog.create(req.body.blog,(err,newBlog)=>{
        if(err){
            console.log(err);
        }else{
            req.flash('success','New Blog Is Created');
            res.redirect('/blogs');
        }
    })
})

//SHOW ROUTE TO SHOW EACH BLOG
app.get('/blogs/:id',(req,res)=>{
    Blog.findById(req.params.id,(err,selectedBlog)=>{
        if(err){
            console.log(err);
        }else{
            res.render('blogs/show',{blog:selectedBlog});
        }
    })
});

//EDIT ROUTE ***SHOW EDIT FORM********
app.get('/blogs/:id/edit',(req,res)=>{
    Blog.findById(req.params.id,(err,editBlog)=>{
        res.render('blogs/edit',{blog:editBlog});
    })
})

//UPDATE ROUTE TO SHOW PUT ROUTE
app.put('/blogs/:id',(req,res)=>{
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,(err,updateBlog)=>{
        if(err){
            console.log(err);
        }else{
            req.flash('success','Blog Is Updated Sucessfully');
            res.redirect('/blogs/'+ req.params.id);
        }
    })
})

//DELETE ROUTE
app.delete('/blogs/:id',(req,res)=>{
    Blog.findByIdAndRemove(req.params.id,(err,deletedBlog)=>{
        req.flash('error','Blog is deleted ..')
        res.redirect('/blogs');
    })
})
//==============
//REGISTER ROUTE
//==============

app.get('/register',(req,res)=>{
    res.render('user/register');
})
//TRANFERRING DATA TO DATABASE AND CHECKING IF USERNAME IS ALREADY CREATED
app.post('/register',(req,res)=>{
    var newUser = new  User({username : req.body.username});
    User.register(newUser,req.body.password,(err,user)=>{
        if(err){
            req.flash('error',err.message);
            res.redirect('back');
        }
        passport.authenticate("local")(req,res,function (){
            req.flash('success','Sign up Successfull....');
            res.redirect("/blogs");
        });
    });
});
//LOGIN ROUTE//
app.get('/login',(req,res)=>{
    res.render('user/login');
});
//LOGIN LOGIC
app.post('/login',passport.authenticate("local",{
    successRedirect : "/blogs",
    failureRedirect : "/login"
}),(req,res)=>{
    
})
//LOGOUT ROUTE
app.get('/logout',(req,res)=>{
    req.logOut();
    req.flash("success","You are Log Out....")
    res.redirect('/blogs')
})


//MIDDLEWARE
function Isloggedin(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You Need To Log In First")
    res.redirect("/login");
}
//SERVER CODE
app.listen(port,()=>{
    console.log('The server is running');
})
