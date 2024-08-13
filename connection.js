const mysql = require('mysql');

const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'website_database'
});
db.connect((error)=>{
    if(error){
        throw error;
    }else{
        console.warn("connected succesfully")
    }
});
module.exports = db;