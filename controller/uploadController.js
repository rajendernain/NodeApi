const express = require('express');
const multer = require('multer');
const path = require('path');
const conn = require('../db/connection');

var uploadProfile = async (req,res)=>{

    const fileStorage = multer.diskStorage({
        destination: 'images',
        filename: (req,file,cb)=>{
            cb(null,file.fieldname + "_" + Date.now()+path.extname(file.originalname));
        }
    });
    
    const uploadImage = multer({
        storage: fileStorage,
        limits: {
            fileSize: 10000000
        },
        fileFilter(req,file,cb){
            if(!file.originalname.match(/\.(png|jpg)$/)){
                return cb(new Error('Please uploade an image file'));
            }
            cb(undefined,true);
        }
    }).single('image');

    uploadImage(req,res,function(err) {        
       var imgsrc = 'images/' + req.file.filename;
       console.log(imgsrc);
       var insertData = "INSERT INTO product(user_id,image,date)VALUES('1','"+imgsrc+"',now())"
       conn.query(insertData, (err, result) => {
                if (err) throw err
                console.log("file uploaded")
            });
        res.send(req.file);
    });
}

module.exports={uploadProfile:uploadProfile}