const router = require('express').Router();
const User =  require('../model/User')
const Joi= require('@hapi/joi');
const bcrypt = require('bcryptjs');
const jwt  = require('jsonwebtoken');        
const { registerValidation, loginValidation } = require('../validation');





router.post('/register',async (req,res)=> {

    const {error} = registerValidation(req.body);

    // const { error } = schema.validate(req.body);    

    if(error) return res.status(400).send(error.details[0].message)

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
        // res.send(savedUser);

        res.redirect('/api/posts')

    } catch(err) {
        res.status(400).alert(err);
     
    }
   
})


router.post('/login', async (req,res)=> {


    const {error} = loginValidation(req.body);  
    if(error) return res.status(400).send(error.details[0].message);

  
    const user = await User.findOne ({email:req.body.email});   
    if(!user) return res.status(400).send('Emails not found');


    const validPass =  await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send(' password is wrong');

    const token =  jwt.sign({_id:user.id},
        process.env.TOKEN_SECRET);

    res.cookie('authcookie',token,{maxAge:900000,httpOnly:true})

    

    res.render('sucess.ejs')
    // res.header('auth-token',token).send(token);

    // res.header('auth-token',token).render('sucess.ejs')


    

})




// router.get('/logout', async (req,res)=> {

//     res.header('auth-token',null);
//     res.redirect('/');  


// })

router.get('/logout', function (req, res, next) {
    res.cookie('authcookie', {}, {maxAge: -1});
    res.redirect('/')
});

module.exports = router;