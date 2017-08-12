const express = require('express');
const router = express.Router();
const User = require('../modles/mongo/user');
const auth = require('../middlewares/auth_user');
const multer  = require('multer');
const path = require('path');
const upload = multer({ dest: path.join(__dirname,'../public/upload') });
const Host = process.env.NODE_ENV === 'production' ? 'http://some.host':'http://localhost:9090';

// localhost:9090/user
router.route('/')
    .get((req, res, next) => {
        (async () => {
            let users = await User.getUsers();
            return {
                code: 0,
                users: users
            }
        })()
            .then(r => {
                res.json(r);
            })
            .catch(e => {
                next(e);
            })
    })
    .post((req, res, next) => {
        (async () => {
            let user = await User.createANewUser({
                name: req.body.name,
                age: req.body.age,
                password: req.body.password,
                phoneNumber: req.body.phoneNumber
            });
            return {
                code: 0,
                user: user
            }
        })()
            .then(r => {
                res.json(r);
            })
            .catch(e => {
                next(e);
            })
    });

// localhost:9090/user/chenxuan
router.route('/:id')
    .get((req, res, next) => {
        (async () => {
            let user = await User.getUserById(req.params.id);
            return {
                code: 0,
                user: user
            }
        })()
            .then(r => {
                res.json(r);
            })
            .catch(e => {
                next(e);
            })
    })
    .patch(auth(),upload.single('avatar'),(req, res, next) => {
        (async () => {
            let updata = {};
            if(req.body.name) updata.name = req.body.name;
            if(req.body.age) updata.age = req.body.age;
            updata.avatar = `/upload/${req.file.filename}`;
            let user = await User.updateUserById((req.params.id), updata);
            user.avatar = `${Host}${user.avatar}`;
            return {
                code: 0,
                user: user
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
