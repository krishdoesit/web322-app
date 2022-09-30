var required= require("./blog-service");
const express=require("express");
const { dirname } = require("path");
const path = require("path");
var blogservice=require(__dirname+"/blog-service.js")

const { application } = require("express");
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
    blogservice.getAllPosts().then((data)=>{
        res.json({data});
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

app.get('*',(req,res)=>{
    res.status(404).send("Page Not Found");
})

blogservice.initialize().then(()=>{
    app.listen(PORT,onHTTPStart());
}).catch(()=>{
 console.log("unable to read file");
});
//