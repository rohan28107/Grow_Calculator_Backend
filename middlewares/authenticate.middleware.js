const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.headers.authorization;
    if(token){
        jwt.verify(token, 'myappsecret', (err, decoded) => {
            if(decoded){
                req.body.userId = decoded.userId;
                next();
            }else{
                res.send({ "msg": "please login" });
            }
        })
    }else{
        res.send({ "msg": "Please login" });
    }
}

module.exports = {
    authenticate
}