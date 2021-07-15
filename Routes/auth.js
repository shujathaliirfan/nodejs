const router = require('express').Router();
const User =  require('../model/User')
const Joi= require('@hapi/joi');
const bcrypt = require('bcryptjs');
const jwt  = require('jsonwebtoken');        
const { registerValidation, loginValidation } = require('../validation');

const {generateAccessToken,generateRefreshToken} = require('../utils/utils')


let refreshTokens = [];


router.post('/register',async (req,res)=> {

    const {error} = registerValidation(req.body);

    // const { error } = schema.validate(req.body);    

    if(error) return res.status(400).send(error.details[0].message);

    const emailExist = await User.findOne ({email:req.body.email});

    if(emailExist) return res.status(400).send('Email Already exists');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password,salt);

    const user = new User({
        name:req.body.name,
        email:req.body.email,
        password:hashedPassword
    })

    try {
        const savedUser = await user.save();
        res.send('User created Successfully');

       

    } catch(err) {
        res.status(400).send(err);
     
    }
   
})


router.post('/login', async (req,res)=> {


    try {
    

    const {error} = loginValidation(req.body);  
    if(error) return res.status(400).send(error.details[0].message);

  
    const user = await User.findOne ({email:req.body.email});   
    if(!user) return res.status(400).send('Emails not found');


    const validPass =  await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send(' password is wrong');

    // const token =  jwt.sign({_id:user.id},
    //     process.env.TOKEN_SECRET,{expiresIn:'24h'});


        // const accessToken = jwt.sign({_id:user.id,
        // username:user.username}, process.env.TOKEN_SECRET,{ expiresIn: '5s' });

        // const refreshToken = jwt.sign({_id:user.id,username:user.username},
        //     process.env.REFRESH_TOKEN_SECRET)

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user)
       
            refreshTokens.push(refreshToken);


       res.json ({accessToken:accessToken,
        refreshToken:refreshToken,
   
        // expiresIn:Date.now() + parseInt(process.env.JWT_EXPIRE),

        expiresIn: parseInt(process.env.JWT_EXPIRE),
        user
        })
    // res.cookie('authcookie',token,{maxAge:900000,httpOnly:true})

       
}
catch(error) {
    // res.status(400).send(error.message);
      res.status(400).send(error);
    // console.log(err)
 
}})



router.post('/token', (req, res) => {
    const { token } = req.body;

    if (!token) return res.sendStatus(400).send('No token found');   

    if (!refreshTokens.includes(token)) return res.sendStatus(403).send("this is not a valid refresh token ");    

    try {
        const user = jwt.verify(token,process.env.REFRESH_TOKEN_SECRET);
        let newAccessToken = generateAccessToken(user);
       let newRefreshToken = generateRefreshToken(user);
  
      refreshTokens.push(newRefreshToken);
  
      res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        expiresIn: parseInt(process.env.JWT_EXPIRE)
        
      });

    } catch(err) {
        res.status(400).send('invalid token');

    }
});


// router.post("/refresh", (req, res) => {
//     //take the refresh token from the user
//     const refreshToken = req.body.token;
  
//     //send error if there is no token or it's invalid
//     if (!refreshToken) return res.status(401).json("You are not authenticated!");
//     if (!refreshTokens.includes(refreshToken)) {
//       return res.status(403).json("Refresh token is not valid!");
//     }
//     jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET, (err, user) => {
//       err && console.log(err);
//     //   refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
  
//        let newAccessToken = generateAccessToken(user);
//       let newRefreshToken = generateRefreshToken(user);
  
//       refreshTokens.push(newRefreshToken);
  
//       res.status(200).json({
//         accessToken: newAccessToken,
//         refreshToken: newRefreshToken
//       });
//     });
  
//     //if everything is ok, create new access token, refresh token and send to user
//   });

// router.get('/logout', async (req,res)=> {

//     res.header('auth-token',null);
//     res.redirect('/');  


// })

// router.get('/logout', function (req, res, next) {
//     res.cookie('authcookie', {}, {maxAge: -1});
//     res.redirect('/')
// });

router.post('/logout', (req, res) => {
    const  refreshToken = req.body.token;
   refreshTokens = refreshTokens.filter(token !==refreshToken);

    res.send("Logout successful");
});

module.exports = router;