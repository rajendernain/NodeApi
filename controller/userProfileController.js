const express = require('express');
const common = require("../common");

var userProfile = async (req,res)=>{
    if(req.user_data>0){
        let user_data = await common.getUserByUserId(req.user_data);

        return res.json({
            status: "sucess",
            message: "User data featch successfully",
            data: user_data
        });

    }else{
        return res.json({
            status: "faild",
            message: "Unauthorized access."
        });
    }
}
module.exports={userProfile:userProfile}