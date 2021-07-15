const express = require('express');
const app = express();
const port = 8000;
const authRoute = require('./Routes/auth');
const postRoute =  require('./Routes/posts');
const mainRoute = require('./Routes/main');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');



app.use(function (req, res, next) {  
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');  
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);    
    next();
});


// var corsOptions = {
//     origin: 'http://localhost:3000',
//     optionsSuccessStatus: 200 // For legacy browser support
// }
// app.use(cors(corsOptions));

dotenv.config();

app.use(bodyParser.urlencoded({extended:true,useUnifiedTopology: true}));
app.use(bodyParser.json());
app.use(cookieParser());

mongoose.connect(process.env.DB_CONNECT, {useNewUrlParser:true},()=>{
    console.log('connected to db')
})

app.set('view engine','ejs');





app.use('/api/user',authRoute);
app.use('/api/posts',postRoute);
app.use('/',mainRoute);


app.listen(port,()=> {
    console.log('app is connected at '+ port);
})