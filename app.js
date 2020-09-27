var port            = process.env.PORT || 3000;
var express         = require('express');
var app             = express();
var flash           = require('connect-flash');
var mongoose        = require('mongoose');
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');
var flash           = require('connect-flash');
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
//MIDDLEWARE TO SEND ERROR AND SUCCESS MESSAGE TO EVERY ROUTE
app.use((req,res,next)=>{
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})
//DATABASE SETUP
// mongoose.connect('mongodb://localhost/JBlogs', {useUnifiedTopology: true,  useNewUrlParser: true });
const MONGODB_URI = 'mongodb+srv://jangiwalia:Bibufateh1@cluster0.3r8va.mongodb.net/JBlogs?retryWrites=true&w=majority' ;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/JBlogs',{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log('connected to db');
}).catch(err=>{
    console.log(err.message);
});
//CREATE SCHEMA
const blogSchema = new mongoose.Schema({
    Title : String,
    Image : String,
    Body : String,
    Created : {type: Date ,default:Date.now}
});

//CREATE MODEL

const Blog = new mongoose.model('blog',blogSchema);

//HOMEPAGE ROUTE
app.get('/',(req,res)=>{
    res.render("landing");
})
//CREATE A SAMPLE BLOGS
/* Blog.create({
    Title: 'Second Blog',
    Image : 'https://images.unsplash.com/photo-1540914124281-342587941389?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=967&q=80',
    Body : `Studies show that vegans have better heart health and lower odds of having certain diseases.
            Those who skip meat have less of a chance of becoming obese or getting heart disease, high cholesterol,
            and high blood pressure. Vegans are also less likely to get diabetes and some kinds of cancer, 
            especially cancers of the GI tract and the breast, ovaries, and uterus in women. `

    

}) */
//INDEX ROUTE WHICH WILL SHOW ALL BLOGS
app.get('/blogs',(req,res)=>{
    Blog.find({},(err,allBlogs)=>{
        if(err){
            console.log(err);
        }else{
            res.render('index',{blogs:allBlogs});
        }
    })
})

//NEW ROUTE WHICH WILL SHOW FORM
app.get('/blogs/new',(req,res)=>{
    res.render('form');
})
// CREATE ROUTE TO CREATE NEW BLOG
app.post('/blogs',(req,res)=>{
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
            res.render('show',{blog:selectedBlog});
        }
    })
});

//EDIT ROUTE ***SHOW EDIT FORM********
app.get('/blogs/:id/edit',(req,res)=>{
    Blog.findById(req.params.id,(err,editBlog)=>{
        res.render('edit',{blog:editBlog});
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

//SERVER CODE
app.listen(port,()=>{
    console.log('The server is running');
})
