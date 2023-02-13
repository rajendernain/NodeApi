const express = require("express");
const bcrypt = require('bcrypt');
const common = require("../common");

var userReg = async (req, res) => {
    const name = (req.body.name) ? req.body.name : '';
    const email = (req.body.email) ? req.body.email : '';
    const phone = (req.body.phone) ? req.body.phone : '';
    const address = (req.body.address) ? req.body.address : '';
    const pass = (req.body.password) ? req.body.password : '';
    const confPassword = (req.body.confPassword) ? req.body.confPassword : '';
    const device_id = (req.headers.device_id) ? req.headers.device_id : '';
    if (email != '') {
        //check user already exist or not
        var result = await common.getUserByEmail(email);
        if (result.length > 0) {
            return res.json({
                status: "faild",
                message: "User already exists with this email"
            });
        } else {
            if (name && email && phone && address && pass && confPassword) {
                if (pass === confPassword) {
                    try {
                        const salt = await bcrypt.genSalt(10);
                        const hashPassword = await bcrypt.hash(pass, salt);
                        let data = {
                            name:name,
                            email:email,
                            phone:phone,
                            address:address,
                            hashPassword:hashPassword,
                        }
                        let qry_result = await common.insertUserRegister(data);
                        console.log(qry_result);
                        //Generate JWT TOken
                        let token = await common.generateAccessToken(device_id,qry_result['insertId']);
                        //Update token in user table
                        await common.updateAccessToken(qry_result['insertId'],token);
                        //Send success respons    
                        return res.json({
                            status: "sucess",
                            message: "User register successfully",
                            token: token
                        });
                    } catch (error) {
                        return res.json({
                            status: "fail",
                            message: "Unable to register"
                        });
                    }
                } else {
                    return res.json({
                        status: "faild",
                        message: "Password and confirm password does`t match"
                    });
                }
            } else {
                return res.json({
                    status: "faild",
                    message: "All fields are required"
                });
            }
        }
    }
}
module.exports = {
    userReg: userReg
};
