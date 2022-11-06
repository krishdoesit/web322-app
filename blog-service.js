var posts=[];
var categories=[];
const { doesNotReject } = require("assert");
const fs=require("fs");
const { resolve } = require("path");

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

exports.addPost=(postData)=>{
    postData.published == undefined ? postData.published=false : postData.published=true;
    postData.id=posts.length+1;
    posts.push(postData);
   // resolve(posts);
    return new Promise((resolve,reject)=>{
        if(posts.length==0){
            reject('no results');
        }
        else{
            resolve(posts);
        }
    })
}

exports.getPostsByCategory=(postcatId)=>{
   return new Promise((resolve,reject)=>{
    var pcategoryid=[];
    for(let i =0; i < posts.length;i++){
        if(posts[i].category==postcatId){
            pcategoryid.push(posts[i]);
        }
    }
    if(pcategoryid){
        resolve(pcategoryid);
    }else{
        reject("no results returned");
    }
   })
} 

exports.getPostsByMinDate=(minDateStr)=>{
    var pdateData=[];
    return new Promise((resolve,reject)=>{
      
        for(let i =0; i < posts.length; i++){
        if(new Date(posts[i].postDate) >= new Date(minDateStr)){
            console.log("The postDate value is greater than minDateStr")
            pdateData.push(posts[i]);
        }
        resolve(pdateData);
    }    
    })
}

exports.getPostById=(id)=>{
  return new Promise((resolve,reject)=>{
    var post_id;
    for(let i=0;i<posts.length;i++){
        if(posts[i].id==id){
            post_id=posts[i];
        }
    }
    if(post_id){
        resolve(post_id);
    }else{
        reject("id not found");
    }
  })
}

exports.getPublishedPostsByCategory=(category)=>{
    return new Promise((response,reject)=>{
        const arrCheck=posts.filter(tc=>tc.published==true && tc.category==category);
        if(posts.lenght==0){
            reject("no results returned");
        }
        else{
            resolve(arrCheck);
            
        }
    })

}

// return new Promise((resolve,reject)=>{
//     const arr1=posts.filter(p=>p.published==true);
//     if(posts.length==0){
//      reject('no results returned');
//     }
//     else{
//      resolve(arr1);
//     }

