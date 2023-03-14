const express = require('express');
const common = require("../common");
var path = require('path');

var userProfile = async (req,res)=>{
    if(req.user_data>0){
        let user_data = await common.getUserByUserId(req.user_data);

        // console.log('=========================');
        // console.log(__filename );
        //console.log('http://'+req.hostname+'3000'+);

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