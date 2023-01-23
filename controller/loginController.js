const express = require("express");
const common = require("../common");
const bcrypt = require("bcrypt");
var userLogin = async (req, res) => {
    var username = req.body.username ? req.body.username : "";
    var password = req.body.password ? req.body.password : "";
    var device_id = req.headers.device_id ? req.headers.device_id : "";
    let user_details = [];
    try {
        if (username != "" && password != "") {
            var result = await common.getUserByEmail(req.body.username);
            if (result.length > 0) {
                result=result[0];
                var existPassword = result["password"];
                //compare user bcrypt password of user req and db password
                const isMatch = await bcrypt.compare(password, existPassword);
                if (isMatch) {
                    //Generate token
                    let access_token = await common.generateAccessToken(device_id,result["user_id"]);
                    //Update token in user table
                    await common.updateAccessToken(result["user_id"],access_token);
                    //Push data in user details arry to send respons to api
                    user_details.push({
                        user_id: result["user_id"],
                        name: result["name"],
                        email: result["email"],
                        phone: result["phone"],
                        date_added: result["date_added"],
                        token: access_token,
                    });
                    return res.json({
                        status: "success",
                        data: user_details,
                        message: "Logged in succesfully",
                    });
                } else {
                    return res.json({
                        status: "fail",
                        message: "Email or Password is not Valid",
                    });
                }
            } else {
                return res.json({
                    status: "fail",
                    message: "You are not a Registered User.",
                });
            }
        } else {
            return res.json({
                status: "fail",
                message: "Either username or password is not correct.",
            });
        }
    } catch (err) {
        console.log(err);
        next(err);
    }
};

module.exports = {
    userLogin: userLogin
};
