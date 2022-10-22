/*********************************************************************************
*  WEB322 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Krish HarshadKumar Student ID: 123898215 Date: 30/09/2022
*
*  Cyclic Web App URL: https://nutty-knickers-fox.cyclic.app/
*
*  GitHub Repository URL: https://github.com/krishdoesit/web322-app
*
********************************************************************************/ 

var required= require("./blog-service");
const express=require("express");
const { dirname } = require("path");
const path = require("path");
var blogservice=require(__dirname+"/blog-service.js")
const multer=require("multer");
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

cloudinary.config({
    cloud_name:'daiwvaoap',
    api_key:'257675341733921',
    api_secret:'0rRGUzEKMVHxbATAYbmMMebPSMg',
    secure:true
});
const upload = multer(); // no { storage: storage } since we are not using disk storage


const { application } = require("express");
const { readSync } = require("fs");
var app=express();
var PORT=process.env.PORT||8080;

function onHTTPStart(){
    console.log("Express http server listening on "+PORT);
}

app.get('/',(req,res)=>{
    res.redirect('/about');
})

app.use(express.static("views"));
app.get('/about',(req,res)=>{
    res.sendFile(path.join(__dirname,"views/about.html"));
});

app.use(express.static('public'));

app.get('/blog',(req,res)=>{
    blogservice.getPublishedPosts().then((data)=>{
        res.json({data});
    }).catch((err)=>{
        res.json({"message":err})
    })
});

app.get('/posts',(req,res)=>{
    if(req.query.category){//query /posts?category
        blogservice.getPostsByCategory(req.query.category).then((categoryId)=>{
            console.log("expected run");
            res.json({categoryId})
        }).catch((err)=>{
            res.json({message:err});
        })
    }
    else if(req.query.minDate){//query /posts?minDate
        blogservice.getPostsByMinDate(req.query.minDate).then((databydate)=>{
            res.json({databydate})
        }).catch((err)=>{
            res.json({message:"error"});
        })
    }
    else{
        blogservice.getAllPosts().then((data)=>{
            res.json({data});
        }).catch((err)=>{
            res.json({message:err});
        })
    }
});


app.get('/posts',(req,res)=>{
    blogservice.getAllPosts().then((data)=>{
        res.json({data});console.log("/posts running");
    }).catch((err)=>{
       res.json({"message":err})
    })
});

app.get('/categories',(req,res)=>{
    blogservice.getCategories().then((data)=>{
        res.json({data});
    }).catch((err)=>{
        res.json({"message":err})
    })
});

app.get('/posts/add',(req,res)=>{
    res.sendFile(path.join(__dirname,"/views/addPost.html"));//sending addPost.html file to route /posts/add
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
        blogservice.addPost(req.body).then(()=>{
        res.redirect("/posts");
        })
    
        // TODO: Process the req.body and add it as a new Blog Post before redirecting to /posts
        
    } 
    
})

// app.post('/posts/add',(req,res)=>{
//     blogservice.addPost(req.body).then(()=>{
//         res.redirect("/posts");
//     })
// })

//posts query routes


app.get("/posts/:id",(req,res)=>{
    blogservice.getPostById(req.params.id).then((data)=>{
        res.json({data});
    }).catch((err)=>{
        res.json({message:err});
    })
});//working perfectlycd



app.get('*',(req,res)=>{
    res.status(404).send("Page Not Found");
})

blogservice.initialize().then(()=>{
    app.listen(PORT,onHTTPStart());
}).catch(()=>{
 console.log("unable to read file");
});
