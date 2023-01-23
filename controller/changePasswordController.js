const express = require("express");
const bcrypt = require("bcrypt");
const constants = require("../constants.js");
const con = require("../db/connection.js").promise();

var changeUserPassword = async (req,res)=>{
    const {password, confPassword}= req.body;

    if(password && confPassword){
        if(password != confPassword){
            return res.json({
                status: "fail",
                message: "New Password and Confirm Password does`t match",
            });
        }else{
            const salt = await bcrypt.genSalt(10);
            const newHashPass = await bcrypt.hash(password, salt);
            const user_id = req.user[0]['user_id'];
            let sql = "UPDATE `users` SET password = '" +newHashPass+"' WHERE user_id = '" +user_id+"'";
            con.query(sql);
            return res.json({
                status: "success",
                message: "Password change successfully",
            });
        }
    }else{
        return res.json({
            status: "fail",
            message: "All fields are required",
        });
    }
}

module.exports = {changeUserPassword:changeUserPassword}