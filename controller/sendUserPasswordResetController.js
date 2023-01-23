const express = require("express");
const con = require("../db/connection.js").promise();
const constants = require("../constants.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
//const transporter = require("../emailConfig.js");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");

var changeUserPassResetEmail = async (req,res)=>{
    const {email} = req.body;
    if(email){
        var qry = "Select * from users Where email='" +email+"' ORDER BY email LIMIT 1";
        let [result] = await con.query(qry);
        if(result.length > 0){
            const secret = result[0]["user_id"]+constants.JWT_AUTH_TOKEN_SECRET;
            const token = jwt.sign({user_id:result[0]["user_id"]},secret,{expiresIn:'15m'});
            const link = `http://127.0.0.1:3000/reset/${result[0]["user_id"]}/${token}`;
           // console.log(link);

            
           // create reusable transporter object using the default SMTP transport
            // let transporter = nodemailer.createTransport({
            //     service: 'gmail',
            //     auth: {
            //         user: 'vrishabsharma61@gmail.com', // generated ethereal user
            //         pass: 'zdqzeremkgbjijef', // generated ethereal password
            //     },
            // });
            // // send mail with defined transport object
            // let info = await transporter.sendMail({
            //     from: 'vrishabsharma61@gmail.com', // sender address
            //     to: 'rajender@keyss.in', // list of receivers
            //     subject: "✔ - Password Reset Link", // Subject line
            //     html: `<a href=${link}>Click Here</a> to Reset Your Password`, // html body
            // });



            return res.json({
                status: "success",
                message: "Email send successfully info: "+link,
            });
        }else{
            return res.json({
                status: "fail",
                message: "Email doesn`t exists",
            });
        }
    }else{
        return res.json({
            status: "fail",
            message: "Email is required",
        });
    }
}

var userPasswordReset = async(req,res)=>{
    const {password,confPassword} = req.body;
    const {id,token} = req.params;
    var qry = "Select * from users Where user_id='" +id+"' ORDER BY email LIMIT 1";
    let [result] = await con.query(qry);
    const new_secret = result[0]["user_id"]+constants.JWT_AUTH_TOKEN_SECRET;
    try {
        jwt.verify(token, new_secret);
        if(password && confPassword){
            if(password !== confPassword){
                return res.json({
                    status: "fail",
                    message: "Password Doesn`t match",
                });
            }else{
                const salt = await bcrypt.genSalt(10);
                const newHashPass = await bcrypt.hash(password, salt);
                let sql = "UPDATE `users` SET password = '" +newHashPass+"' WHERE user_id = '" +result[0]["user_id"]+"'";
                con.query(sql);
                return res.json({
                    status: "fail",
                    message: "Password Reset Successfully",
                });
            }
        }else{
            return res.json({
                status: "fail",
                message: "All fields is required",
            });
        }
    } catch (error) {
        return res.json({
            status: "fail",
            message: "Invalid Token",
        });
    }


}

module.exports = {
    changeUserPassResetEmail:changeUserPassResetEmail,
    userPasswordReset:userPasswordReset,
}