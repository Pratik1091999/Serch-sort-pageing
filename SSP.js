const express = require('express');
const fs = require('fs');
const mongoose = require('mongoose');
const multer = require('multer');
const jwt = require('jsonwebtoken');
var cron = require('node-cron');
const app = express();

mongoose.connect("mongodb+srv://Nandkishor:Desai123@cluster0.2zi3x.mongodb.net/DB?retryWrites=true&w=majority")
.then( ()=> {
    console.log("DateBase connect succesfully")
}).catch((error) => {
    console.log("database connection fail"+error)
})


app.get('/api', (req, res) => {
    res.send("Welcome to the Server")
})

app.use(express.json());

const user = mongoose.model('user', { name: String, email:String, role:String, empid:Number, city:String, mobile:Number, dob:Date, status:Boolean});

app.post('/SignUp', (req, res) => {
    let Emp_name = req.body.name;
    let Emp_email = req.body.email;
    let Emp_role = req.body.role;
    let Emp_empid = req.body.empid;
    let Emp_city = req.body.city;
    let Emp_mobile = req.body.mobile;
    let Emp_dob = new Date(req.body.dob);
    let Emp_status = req.body.status;

    var emp = new user({name:Emp_name, email:Emp_email, role:Emp_role, empid:Emp_empid, city:Emp_city, mobile:Emp_mobile, dob:Emp_dob, status:Emp_status});
    emp.save().then(() => {
        res.status(200).send({status:"Success", message:"Data add successfully"});
    }).catch((error) => {
        res.status(400).send({status:"error", message:"error"})
    })    

});


const port = 7000;
app.listen(port, () =>{
    console.log("Server start" +port)
});

app.get('/Search/:name', (req, res) =>{
    var regex = new RegExp(req.params.name, 'i');
    user.find({name:regex}).then((result) => {
        res.status(200).json(result)
    })
});

app.get('/data', (req,res) =>{
    user.find({}).then((data) => {
        res.status(200).send({ status: "success", message: "Successfullt Data Get.", data: data });
    }).catch(err =>{
        res.status(400).send({ status: "error", message: err });
    })
});

app.get('/user/sort/asc', async(req, res) =>{
    try{
        const records = await user.find({}).sort({name: 1});
        res.status(200).json({"total":records.length, records})
    }catch(err){
        console.log(err)
    }
})
app.get('/user/sort/dec', async(req, res) =>{
    try{
        const records = await user.find({}).sort({name: -1});
        res.status(200).json({"total":records.length, records})
    }catch(err){
        console.log(err)
    }
});

app.get('/user/page', async(req, res) => {
    try{
        const{page = 1, limit = 10} = req.query;
        const data = await user.find().limit(limit *1).skip((page-1)*limit);
        res.status(200).json({"total":data.length, data});
    }catch(err){
        console.log(err);
    }
});


const upload = multer({
    storage:multer.diskStorage({
        destination:function(req, file, cb){
            cb(null, "upload")
        },
        filename:function(req, file, cb){
            cb(null, file.fieldname + "-" + Date.now() + ".jpg")
        }
    })
}).single("user_file");

app.post("/upload",upload,(req, res) => {
    res.send("File uploaded")
});

app.delete('/delete/:file', (req, res) => {
    fs.unlink('./upload/'+req.params.file, function(error){
        if(error){
            console.log(error)
        }else{
            res.send("File Deleted Succesfully")
        }
    })
});


// cron.schedule('8,10,12 51,52,54 * * * *', () => {
//     console.log('running a task every minute')
//   });

app.post('/login', (req, res) =>{
    const user = {
        id:1,
        username:'Nandkishor',
        email:'desai@gmail.com'
    }

    jwt.sign({user}, 'secretkey', (err, token) =>{
        res.json({
            token
        });
    });
});
