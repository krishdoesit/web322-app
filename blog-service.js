var posts=[];
var categories=[];
const fs=require("fs");

exports.initialize=()=>{
    return new Promise((resolve,reject)=>{
        fs.readFile('./data/posts.json',(err,data)=>{
            if(err){
                reject('unable to read file');
            }
            else{
                posts=JSON.parse(data);
            }
        });

        fs.readFile('./data/categories.json',(err,data)=>{
            if(err){
                reject('unable to read file');
            }
            else{
                categories=JSON.parse(data);
            }
        })
        resolve();
    })
}

exports.getAllPosts=()=>{
    return new Promise((resolve,reject)=>{
        if(posts.length==0){
            reject("no results returned");
        }
        else{
            resolve(posts);
        }
    })
}
        

exports.getPublishedPosts=()=>{
    return new Promise((resolve,reject)=>{
       const arr1=posts.filter(p=>p.published==true);
       if(posts.length==0){
        reject('no results returned');
       }
       else{
        resolve(arr1);
       }
    })
}

exports.getCategories=()=>{
    return new Promise((resolve,reject)=>{
        if(categories.length==0){
            reject('no results returned');
        }
        else{
            resolve(categories);
        }
    })
}
//
