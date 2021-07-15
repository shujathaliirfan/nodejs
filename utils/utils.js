const jwt = require("jsonwebtoken");

require('dotenv').config();


const generateAccessToken = (user) => {
    return jwt.sign({ user}, process.env.TOKEN_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
});
  };
  
  const generateRefreshToken = (user) => {
    return jwt.sign({ user}, process.env.REFRESH_TOKEN_SECRET);
  };




module.exports.generateAccessToken  = generateAccessToken;
module.exports.generateRefreshToken  =  generateRefreshToken;