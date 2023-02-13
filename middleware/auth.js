const jwt = require("jsonwebtoken");
const constants = require("../constants.js");
const con = require("../db/connection.js").promise();

var checkValidUser = function(req,res,next){
    var username = (req.body.username)?req.body.username:"";
    var password = (req.body.password)?req.body.password:"";
    var errors = [];
    if(username == ''){
        errors.push("Please enter valid username");
    }else if(password == ''){
        errors.push("Password field is required.");
    }
    if(username != '' && password != ''){
        next();
    }else{
        return res.json({
            status: "402",
            message: errors
        });
    }    
}

var checkRegisterUser = function(req,res,next){
    var name = (req.body.name)?req.body.name:"";
    var email = (req.body.email)?req.body.email:"";
    var phone = (req.body.phone)?req.body.phone:"";
    var address = (req.body.address)?req.body.address:"";
    var confPassword = (req.body.confPassword)?req.body.confPassword:"";
    var password = (req.body.password)?req.body.password:"";
    var errors = [];
    if(name == ''){
        errors.push("Please enter valid name");
    }else if(email == ''){
        errors.push("email field is required.");
    }else if(phone == ''){
        errors.push("phone field is required.");
    }else if(address == ''){
        errors.push("address field is required.");
    }else if(password == ''){
        errors.push("password field is required.");
    }else if(confPassword == ''){
        errors.push("confPassword field is required.");
    }else if(confPassword == password){
        errors.push("password and confPassword not match.");
    }
    if(name && email && phone && password && confPassword){
        next();
    }else{
        return res.json({
            status: "402",
            message: errors
        });
    }    
}

var verifyToken = function(req,res,next){
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer') || !req.headers.authorization.split(' ')[1]) {
        return res.status(401).json({
            message: "You are not looking authorized user.",
            status: 401
        });
    }else if(req.headers.device_id == ''){
        return res.status(401).json({
            message: "Device id is required field",
            status: 401
        });
    }
    const bearerHeader = req.headers.authorization.split(' ');
    const token = bearerHeader[1];
    try{
        const verifyToken = jwt.verify(token, constants.JWT_AUTH_TOKEN_SECRET);
        if (verifyToken.device_id == req.headers.device_id) {
            req.user_data = verifyToken.user_id;
        }else{
            req.user_data = 0;
        }
    }catch(err){
        return res.status(401).json({
            message: "Invalid Token",
            status: 401
        });
    }
    return next(); 
}

var checkUserAuth = async (req,res,next)=>{
    const authorization = (req.headers.authorization) ? req.headers.authorization : '';
    const device_id = (req.headers.device_id) ? req.headers.device_id : '';
    let token;
    if(authorization && authorization.startsWith('Bearer') && device_id != ''){
        try {
            token = authorization.split(' ')[1];
            //verify token
            const token_data = jwt.verify(token,constants.JWT_AUTH_TOKEN_SECRET);
            //Get user from token
            let user_id = token_data.user_id;
            var qry = "Select * from users Where user_id='" +user_id +"' ORDER BY email LIMIT 1";
            let [user_data] = await con.query(qry);
            req.user = user_data;
            next();
        } catch (error) {
            return res.json({
                status: "fail54645",
                message: error,
            });
        }
    }
    if(!token){
        return res.json({
            status: "fail",
            message: "Unauthorized user token not provided",
        });
    }
}

module.exports = {
    checkValidUser:checkValidUser,
    checkRegisterUser:checkRegisterUser,
    verifyToken:verifyToken,
    checkUserAuth:checkUserAuth,
}