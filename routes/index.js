var express         = require('express');
var User            = require('../models/User');
var passport        = require('passport');
var router = express.Router();



//HOMEPAGE ROUTE
router.get('/',(req,res)=>{
    res.render("landing");
})


//REGISTER ROUTE
router.get('/register',(req,res)=>{
    res.render('user/register');
})
//TRANFERRING DATA TO DATABASE AND CHECKING IF USERNAME IS ALREADY CREATED
router.post('/register',(req,res)=>{
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
router.get('/login',(req,res)=>{
    res.render('user/login');
});
//LOGIN LOGIC
router.post('/login',passport.authenticate("local",{
    successRedirect : "/blogs",
    failureRedirect : "/login"
}),(req,res)=>{
    
})
//LOGOUT ROUTE
router.get('/logout',(req,res)=>{
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

module.exports = router;