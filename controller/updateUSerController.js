const con = require("../db/connection.js").promise();
const express = require("express");
const jwt = require("jsonwebtoken");
const constants = require("../constants");

var updateUser = async (req,res)=>{
    const email = (req.body.email)?req.body.email:'';
    const name = (req.body.name)?req.body.name:'';
    const phone = (req.body.phone)?req.body.phone:'';
    const device_id = (req.body.device_id)?req.body.device_id:'';  

    if(email && phone){
        if(req.user_data){
            let sql = "UPDATE `users` SET email = '" +email+"',name = '" +name+"',phone = '" +phone+"',date_added = '" +Date.now()+"' WHERE user_id = '" +req.user_data+"'";
            console.log(sql);
            con.query(sql);
            return res.json({
                status: "Success",
                message: "User updated successfully",
            });
        }else{
            return res.json({
                status: "fail",
                message: "Authentication failed.",
            });
        }
    }else{
        return res.json({
            status: "fail",
            message: "Email or Phone is required fields",
        });
    }
}
var deleteUser = async (req,res)=>{
    const user_id = (req.body.user_id)?req.body.user_id:'';
    const device_id = (req.body.device_id)?req.body.device_id:'';  

    if(user_id!=''){
        if(req.user_data){
            let sql = "DELETE from users WHERE user_id = '" +req.user_data+"' ";
            con.query(sql);
            return res.json({
                status: "Success",
                message: "User delete successfully",
            });
        }else{
            return res.json({
                status: "fail",
                message: "Authentication failed.",
            });
        }
    }else{
        return res.json({
            status: "fail",
            message: "Something went wrong",
        });
    }
}

module.exports = {updateUser:updateUser,deleteUser:deleteUser}