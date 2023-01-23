const mysql = require('mysql2');
const con = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"flutter_api"
});

con.connect((err)=>{ 
    if(err){
        console.log('Connection not propper');
    }
});
module.exports = con;