const router = require('express').Router();


router.get('/',(req,res)=> {
    res.send({messages:'error occured ji'})
})

router.get('/login',(req,res)=> {
    res.render('login.ejs',{messages:'error occured ji'})
})


router.get('/register',(req,res)=> {
    res.render('register.ejs')
})


module.exports = router;