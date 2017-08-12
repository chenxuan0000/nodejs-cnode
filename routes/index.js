const express = require('express');
const router = express.Router();
const User = require('../modles/mongo/user');
const JWT = require('jsonwebtoken');
const JWT_SECRET = require('../cipher').JWT_SECRET;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
/* POST login. */
router.post('/login', function(req, res, next) {
    (async() => {
      const user = await User.login(req.body.phoneNumber,req.body.password);
      //JWT方式来生成token
      const token = JWT.sign({_id:user._id,iat:Date.now(),expire:Date.now() + 24*60*60*1000},JWT_SECRET);

      return {
        code : 0,
          data : {
            user:user,token: token
          }
      }
    })()
        .then(r => {
          res.json(r);
        })
        .catch(e => {
          next(e);
        })
});

module.exports = router;
