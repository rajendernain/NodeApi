const con = require('./db/connection').promise();
const constants = require("./constants");
const jwt = require("jsonwebtoken");
//Get user details by email
var getUserByEmail = async (email)=>{
    var qry = "Select * from users Where email='" +email+"' ORDER BY email LIMIT 1";
     let [result] = await con.query(qry);
    return result;
}//Get user details by user_id
var getUserByUserId = async (user_id)=>{
    var qry = "Select u.user_id, u.name, u.email, u.phone, u.address, p.image from users as u INNER JOIN product as p ON u.user_id = p.user_id Where u.user_id='" +user_id+"' ORDER BY u.user_id DESC LIMIT 1";
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
    let sql = "INSERT INTO users (name,email,phone,address,password,token,date_added) VALUES ('" + data.name + "','" + data.email + "','" + data.phone + "','" + data.address + "','" + data.hashPassword + "','','" + Date.now() + "')";
    let [qry_result] = await con.query(sql);
    return qry_result;
}

module.exports={getUserByEmail,updateAccessToken,generateAccessToken,insertUserRegister,getUserByUserId};