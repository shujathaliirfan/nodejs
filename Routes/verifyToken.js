const jwt = require('jsonwebtoken');


const auth = (req,res,next) => {
    let token = req.headers["x-access-token"];

    // const authHeader =   req.headers['authorization'];
    // const token = authHeader && authHeader.split("")[1];
    if (token == null ) res.sendStatus(401),send('token not found')
 
    // if (authHeader) {
    //     const token =  authHeader.split(" ")[1];
    // }

    // const token = req.header('token');

    // const token = req.cookies.authcookie;

    if(!token) return res.status(401).send('Access Denied');
    // if(!token) return res.status(401).redirect('/');

    try {
        const verified = jwt.verify(token,process.env.TOKEN_SECRET);
        req.user = verified;
        console.log(req)
        next();

    } catch(err) {
        res.status(400).send('invalid token');

        // res.status(400).redirect('/')
    }
}

module.exports = auth;