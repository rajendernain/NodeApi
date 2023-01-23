var user_details=function(req,res,next){ 
    console.log(req.body);
    // if(errors.length <= 0){
    //     var qry = "Select * from users Where email='"+username+"' AND password='"+password+"' ORDER BY email LIMIT 1"
    //     con.query(qry, function(err, result, field){
    //         if(err){
    //             throw err;
    //         }
    //         console.log(result);
    //     });
    // }
};


module.exports={ user_details:user_details}   