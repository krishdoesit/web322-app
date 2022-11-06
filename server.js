/*********************************************************************************
*  WEB322 – Assignment 04
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: krish Harshadkumar Patel Student ID: 123898215 Date: 2022/11/06
*
*  Cyclic Web App URL: https://nutty-knickers-fox.cyclic.app/
* 
*  GitHub Repository URL: https://github.com/krishdoesit/web322-app
*
********************************************************************************/


//var required= require("./blog-service");
//const { dirname } = require("path");
//var blogservice=require(__dirname+"/blog-service.js");
const express=require("express");
const path = require("path");
const blogData=require("./blog-service");
const multer=require("multer");
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const stripJs=require('strip-js');


//cloudinary config//////////////////////////
cloudinary.config({
    cloud_name:'daiwvaoap',
    api_key:'257675341733921',
    api_secret:'0rRGUzEKMVHxbATAYbmMMebPSMg',
    secure:true
});
const upload = multer(); // no { storage: storage } since we are not using disk storage

var app=express();
var PORT=process.env.PORT||8080;

//managing Handlebars////////////////////////////////////////////////////////////////////////
const exphbs = require('express-handlebars');
app.set('view engine', '.hbs');
app.use(function(req,res,next){
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
    app.locals.viewingCategory = req.query.category;
    next();
});

function onHTTPStart(){
    console.log("Express http server listening on "+PORT);
}

app.get('/',(req,res)=>{
    res.redirect('/blog');
})

app.use(express.static("views"));
app.get("/about",(req,res)=>{
    res.render("about");
});

//custom helpers///////////////////////////////////////////
app.engine('.hbs', exphbs.engine({ 
    extname: '.hbs',
    helpers: { 
        safeHTML: function(context) {
            return stripJs(context)
        },
        navLink: function(url, options){
            return '<li' + 
                ((url == app.locals.activeRoute) ? ' class="active" ' : '') + 
                '><a href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }        
    }
}));

app.use(express.static('public'));

app.get('/blog', async (req, res) => {

    // Declare an object to store properties for the view
    let viewData = {};

    try{
        

        // declare empty array to hold "post" objects
        let posts = [];

        // if there's a "category" query, filter the returned posts by category
        if(req.query.category){
            
            // Obtain the published "posts" by category
            posts = await blogData.getPublishedPostsByCategory(req.query.category);
        }else{
            // Obtain the published "posts"
            posts = await blogData.getPublishedPosts();
        }
        

        // sort the published posts by postDate
        posts.sort((a,b) => new Date(b.postDate) - new Date(a.postDate));

        // get the latest post from the front of the list (element 0)
        let post = posts[0]; 

        // store the "posts" and "post" data in the viewData object (to be passed to the view)
        viewData.posts = posts;
        viewData.post = post;

    }catch(err){
        viewData.message = "no results";
    }

    try{
        // Obtain the full list of "categories"
        let categories = await blogData.getCategories();

        // store the "categories" data in the viewData object (to be passed to the view)
        viewData.categories = categories;
    }catch(err){
        viewData.categoriesMessage = "no results"
    }

    // render the "blog" view with all of the data (viewData)
    res.render("blog", {data: viewData})

});

app.get('/blog/:id', async (req, res) => {

    // Declare an object to store properties for the view
    let viewData = {};

    try{

        // declare empty array to hold "post" objects
        let posts = [];

        // if there's a "category" query, filter the returned posts by category
        if(req.query.category){
            // Obtain the published "posts" by category
            posts = await blogData.getPublishedPostsByCategory(req.query.category);
        }else{
            // Obtain the published "posts"
            posts = await blogData.getPublishedPosts();
        }

        // sort the published posts by postDate
        posts.sort((a,b) => new Date(b.postDate) - new Date(a.postDate));

        // store the "posts" and "post" data in the viewData object (to be passed to the view)
        viewData.posts = posts;

    }catch(err){
        viewData.message = "no results";
    }

    try{
        // Obtain the post by "id"
        viewData.post = await blogData.getPostById(req.params.id);
    }catch(err){
        viewData.message = "no results"; 
    }

    try{
        // Obtain the full list of "categories"
        let categories = await blogData.getCategories();

        // store the "categories" data in the viewData object (to be passed to the view)
        viewData.categories = categories;
    }catch(err){
        viewData.categoriesMessage = "no results"
    }

    // render the "blog" view with all of the data (viewData)
    res.render("blog", {data: viewData})
});



app.get('/posts',(req,res)=>{
    if(req.query.category){//query /posts?category
        blogData.getPostsByCategory(req.query.category).then((categoryId)=>{
            res.render("posts",{posts:categoryId});
         //res.json({categoryId})
        }).catch((err)=>{
            res.json({message:err});
        })
    }
    else if(req.query.minDate){//query /posts?minDate
        blogData.getPostsByMinDate(req.query.minDate).then((databydate)=>{
            res.json({databydate})
        }).catch((err)=>{
            res.json({message:"error"});
        })
    }
    else{
        blogData.getAllPosts().then((data)=>{
            //res.json({data});
            res.render("posts",{posts:data}); 
        }).catch((err)=>{
            //res.json({message:err});
            res.render("posts",{message:"no results"});
        })
    }
});


app.get('/posts',(req,res)=>{
    blogData.getAllPosts().then((data)=>{
       res.render("posts",{posts:data});   
    }).catch((err)=>{
       res.render("posts",{message:"no results"});
    })
});

app.get('/categories',(req,res)=>{
    blogData.getCategories().then((data)=>{
        //res.json({data});
        res.render("categories",{categories:data})
    }).catch((err)=>{
        res.json({"message":err})
    })
});

app.get('/posts/add',(req,res)=>{
    res.render("addPost");//sending addPost.html file to route /posts/add
})

app.post('/posts/add',upload.single("featureImage"),(req,res)=>{
    if(req.file){
        let streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream(
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );
    
                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };
    
        async function upload(req) {
            let result = await streamUpload(req);
            console.log(result);
            return result;
        }
    
        upload(req).then((uploaded)=>{
            processPost(uploaded.url);
        });
    }else{
        processPost("");
    }
     
    function processPost(imageUrl){
        req.body.featureImage = imageUrl;
        blogData.addPost(req.body).then(()=>{
        res.redirect("/posts");
        })
    
        // TODO: Process the req.body and add it as a new Blog Post before redirecting to /posts
        
    } 
    
})


app.get("/posts/:id",(req,res)=>{
    blogData.getPostById(req.params.id).then((data)=>{
        res.json({data});
    }).catch((err)=>{
        res.json({message:err});
    })
});//working perfectlycd


//rendering 404 error page
app.get('*',(req,res)=>{
   res.render("404");
})

blogData.initialize().then(()=>{
    app.listen(PORT,onHTTPStart());
}).catch(()=>{
 console.log("unable to read file");
});
