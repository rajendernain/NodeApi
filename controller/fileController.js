const express = require('express');
//const { path } = require('express/lib/application');
const fs = require('fs');
const path = require('path');

var fileSystem = async (req,res)=>{
    var file_name = req.body.name ? req.body.name : "";
    var content = req.body.content ? req.body.content : "";
    var action = req.body.action ? req.body.action : "";
    var line = req.body.line ? req.body.line : "";

    if(content == ''){
        return res.json({
            status: "fail",
            message: "Please enter valid content",
        });
    }

    if(action == 'delete'){
        fs.unlink("files/"+file_name+".txt",(err)=>{
            return res.json({
                status: "success",
                message: "File deleted successfully",
            });
        });
    }else if(action == 'remove'){
        fs.truncate("files/"+file_name+".txt",line, function(){console.log('done')});
        return res.json({
            status: "success",
            message: "record delete successfully",
        });
    }else{
            if(file_name != '' && content != ''){   
                if(fs.existsSync("files/"+file_name+".txt")){
                    fs.appendFile("files/"+file_name+".txt", content, function (err) { 
                        if (err)
                            console.log(err);
                    });
                    return res.json({
                        status: "success",
                        message: "files/"+file_name+".txt updated successfully",
                    });
                }else{
                    fs.writeFile("files/"+file_name+".txt", content, function (err) { 
                        if (err)
                            console.log(err);
                    });
                    return res.json({
                        status: "success",
                        message: "files/"+file_name+".txt created successfully",
                    });
                }
            }else{
                return res.json({
                    status: "fail",
                    message: "Please send a valid file name",
                });
            }
    }
}

module.exports={fileSystem};