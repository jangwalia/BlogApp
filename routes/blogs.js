var express = require('express');
var Blog    = require('../models/Blog');
var router  = express.Router();




router.get('/blogs',(req,res)=>{
    Blog.find({},(err,allBlogs)=>{
        if(err){
            console.log(err);
        }else{
            res.render('blogs/index',{blogs: allBlogs});
        }
    })
})

//NEW ROUTE WHICH WILL SHOW FORM
router.get('/blogs/new',Isloggedin,(req,res)=>{
    res.render('blogs/form');
})
// CREATE ROUTE TO CREATE NEW BLOG
router.post('/blogs',Isloggedin,(req,res)=>{
    var title = req.body.title;
    var image = req.body.image;
    var body = req.body.body;
    var author = {
        id : req.user._id,
        username : req.user.username
    }
    var createdBlog = {Title : title, Image: image, Body: body, Author: author} 
    Blog.create(createdBlog,(err,newBlog)=>{
        if(err){
            console.log(err);
        }else{
            req.flash('success','New Blog Is Created');
            res.redirect('/blogs');
        }
    });
});

//SHOW ROUTE TO SHOW EACH BLOG
router.get('/blogs/:id',(req,res)=>{
    Blog.findById(req.params.id,(err,selectedBlog)=>{
        if(err){
            console.log(err);
        }else{
            res.render('blogs/show',{blog:selectedBlog});
        }
    })
});




//EDIT ROUTE ***SHOW EDIT FORM********
router.get('/blogs/:id/edit',isAuthorized,(req,res)=>{
    Blog.findById(req.params.id,(err,editBlog)=>{
        res.render('blogs/edit',{blog:editBlog});
    })
})

//UPDATE ROUTE TO SHOW PUT ROUTE
router.put('/blogs/:id',isAuthorized,(req,res)=>{
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
router.delete('/blogs/:id',isAuthorized,(req,res)=>{
    Blog.findByIdAndRemove(req.params.id,(err,deletedBlog)=>{
        req.flash('error','Blog is deleted ..')
        res.redirect('/blogs');
    })
})
//MIDDLEWARE TO CHECK IF THE USER OWNS THE CURRENT BLOG
function isAuthorized(req,res,next){
    if(req.isAuthenticated()){
        Blog.findById(req.params.id,(err,foundBlog)=>{
            if(err){
                
                res.redirect("back");
            }else{
                if(foundBlog.Author.id.equals(req.user._id)){
                 next();
                }else{
                    req.flash("error","you dont have permission to do that");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error","you need to log in");
        res.redirect("back")
    }
}
//MIDDLEWARE TO CHECK IF THE USER IS LOGGED IN
function Isloggedin(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You Need To Log In First")
    res.redirect("/login");
}

module.exports = router;