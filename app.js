const express = require('express');
const mysql = require('mysql');
const path = require('path');
const db = require('./connection');
const app = express();
const port = 3100;

//configuration
app.set("view engine", "hbs");
app.set("views", "./view");
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/view"));
app.use('/images', express.static(path.join(__dirname, 'images')));


//routers
app.get("/", (req, res) => {
    res.render("index");
})
app.get("/login", (req, res) => {
    res.render("login");
})
app.get("/signup", (req, res) => {
    res.render("signup");
});
app.get('/about',(req,res)=>{
    res.render("about");
})
app.get('/contact',(req,res)=>{
    res.render('contact')
})
app.get('/services',(req,res)=>{
    res.render('services')
})
app.get('/weather',(req,res)=>{
    res.render('weather')
})




app.get('/submitData', (req, res) => {
    const { name, email, phone, password, confirmpassword } = req.query;
    let qry = "SELECT * FROM records WHERE email = ? OR contact = ?";

    db.query(qry, [email, phone], (err, result) => {
        if (err) {
            throw err;
        } else {
            if (result.length > 0) {
                res.render('signup', { msg: 'Email or phone already exists' });
            } else {
                if (!password || !confirmpassword) {
                    res.render('signup', { confirmmsg: 'Password fields cannot be empty' });
                } else if (password !== confirmpassword) {
                    res.render('signup', { confirmmsg: 'Passwords do not match' });
                } else {
                    let qry2 = "INSERT INTO records (name, email, contact, password) VALUES (?, ?, ?, ?)";
                    db.query(qry2, [name, email, phone, password], (error, result) => {
                        if (error) {
                            throw error;
                        } else {
                            res.render('signup', { successmsg: 'Account created successfully please login' });
                        }
                    });
                }
            }
        }
    });
});

app.get('/loginuser', (req, res) => {
    const { emailfield, passwordfield } = req.query;
    // console.log(`Email: ${emailfield}, Password: ${passwordfield}`); 

    if (!emailfield || !passwordfield) {
        res.render('login', { error: "Email and password must be provided!" });
        return;
    }

    let qry = "SELECT * FROM records WHERE email = ? AND password = ?";

    db.query(qry, [emailfield, passwordfield], (error, result) => {
        if (error) {
            // console.error('Error executing query:', error);  
            throw error;
        } else {
            // console.log('Query Result:', result);  
            if (result.length === 0) {
                res.render('login', { error: "Email and password incorrect!" });
            } else {
                res.redirect('/');
            }
        }
    });
});

app.get('/feedback',(req,res)=>{
    const {name,email,address,phone,textarea} = req.query;
    let qry = "SELECT * FROM message WHERE email = ? or phone = ?";
    db.query(qry,[email,phone],(err,result)=>{
        if(err) throw err;
        else{
            if(result.length >0){
                res.render('index',{msg1:'email and phone no already exist'});
            }else{
                let qry2 = "insert into message (name , email ,address,phone,feedback) values (?,?,?,?,?)";
                db.query(qry2,[name,email,address,phone,textarea],(err,result)=>{
                    if(err)throw err;
                    else{
                        res.render('index',{msg:"thank you for Your Feedback :)"})
                    }
                })
            }
        }
    })

})

//app listning port
app.listen(port, '0.0.0.0', () => {
    console.warn(`app is running on http://0.0.0.0 ${port}`);
})