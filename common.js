const con = require('./db/connection').promise();
const constants = require("./constants");
const jwt = require("jsonwebtoken");
//Get user details by email
var getUserByEmail = async (email)=>{
    var qry = "Select * from users Where email='" +email+"' ORDER BY email LIMIT 1";
     let [result] = await con.query(qry);
    return result;
}
//Update user access token 
var updateAccessToken = async (user_id,access_token)=>{
    let sql = "UPDATE `users` SET token = '"+access_token+"' WHERE user_id = '" +user_id+ "'";
    con.query(sql);
}
//Generate user new access token
var generateAccessToken = async (device_id,user_id)=>{
    let access_token = jwt.sign({
        device_id: device_id,
        user_id: user_id
        },
        constants.JWT_AUTH_TOKEN_SECRET, {
            expiresIn: constants.JWT_EXPIRES_IN
        }
    );
    return access_token;
}
var insertUserRegister = async (data)=>{
    let sql = "INSERT INTO users (name,email,phone,password,token,date_added) VALUES ('" + data.name + "','" + data.email + "','" + data.phone + "','" + data.hashPassword + "','','" + Date.now() + "')";
    let [qry_result] = await con.query(sql);
    return qry_result;
}

module.exports={getUserByEmail,updateAccessToken,generateAccessToken,insertUserRegister};