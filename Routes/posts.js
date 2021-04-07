const router = require('express').Router();
const verify = require('./verifyToken')


router.get('/', verify,(req,res) => {

    // res.send (req.user);  to know the current user id and details;


    res.json ({
        posts:{
            title:'jsonwebtoken tutorial',
            desscription: 'its something new i thought about'
        }
    })
})

module.exports = router;