const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')
const md5 = require('md5')

let initial_path = path.join(__dirname, "public")

let app = express()

app.use(express.static(initial_path))

const userSchema = new mongoose.Schema({
    "email" : String,
    "name" : String ,
    "password": String
})

const User = mongoose.model("users",userSchema);

app.get('/', (req, res) => {
    res.sendFile(path.join(initial_path, "index.html"));
})


app.get('/home', (req, res) => {
    res.sendFile(path.join(initial_path, "home.html"));
})

app.get('/signup', (req, res) => {
    res.sendFile(path.join(initial_path, "signup.html"));
})

app.get('/login', (req, res) => {

    res.sendFile(path.join(initial_path, "login.html"));
})

app.get('/:id', (req, res) => {
    res.sendFile(path.join(initial_path, "about.html"));
})

app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended: true
}))

mongoose.connect("mongodb://127.0.0.1:27017/netflixDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;


app.post("/signup", (req, res) => {
    const user = {
        name: req.body.username,
        email: req.body.email,
        password: md5(req.body.password)
    };

    var data = {
        "name" : user.name ,
        "email" : user.email,
        "password" : user.password
    }


    db.collection('users').insertOne(data, (err, collection) => {
        if (err) {
            throw err;

        } else {
            console.log("Record Inserted Successfully!!");
            res.sendFile(path.join(initial_path, "login.html"));
        }

    });
});

app.post("/login", (req, res) => {
    var name = req.body.username;
    var password = md5(req.body.password);
    
    db.collection('users').findOne(({"name":name}), (err, foundbro) => {
        if (err) {
            throw err;

        } else {
            
            if(foundbro){
                console.log("Found bro !!");
                if(foundbro.password === password){
                    console.log("Authenticated !")
                    res.sendFile(path.join(initial_path, "home.html"));
                }else{
                    console.log("Not authenticated !")
                    res.sendFile(path.join(initial_path, "noauth.html"));
                }
                
            }else{
                console.log("bro not found")
            }
        
        }

    });


})


//Authentication

const userss = [{name:"Apurva"}]

app.get('/userss',(req,res)=>{
    res.json(userss);
})



app.listen(4131, () => {
    console.log("Server is listening on port http://localhost:4131")
})