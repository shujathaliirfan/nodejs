const jwt = require('jsonwebtoken');


const auth = (req,res,next) => {
    // const token = req.header('auth-token');

    const token = req.cookies.authcookie;

    // if(!token) return res.status(401).send('Access Denied');
    if(!token) return res.status(401).redirect('/');

    try {
        const verified = jwt.verify(token,process.env.TOKEN_SECRET);
        req.user = verified;
        next();

    } catch(err) {
        res.status(400).send('invalid token');

        // res.status(400).redirect('/')
    }
}

module.exports = auth;