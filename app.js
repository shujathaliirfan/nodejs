const express = require('express');
const app = express();
const port = 3000;
const authRoute = require('./Routes/auth');
const postRoute =  require('./Routes/posts');
const mainRoute = require('./Routes/main');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');





dotenv.config();

app.use(bodyParser.urlencoded({extended:true}));
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