const express = require('express');
const router = express.Router();
const User = require('../modles/mongo/user');
const TOPIC = require('../modles/mongo/topic');

// localhost:9090/topic
router.route('/')
    .get((req, res, next) => {
        (async () => {
            let topics = await TOPIC.getTOPICs();
            return {
                code: 0,
                topics: topics
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
            const user = await User.getUserById(req.body.userId);
            let topic = await TOPIC.createANewTOPIC({
                creator: user,
                title: req.body.title,
                content: req.body.content
            });
            return {
                code: 0,
                topic: topic
            }
        })()
            .then(r => {
                res.json(r);
            })
            .catch(e => {
                next(e);
            })
    });

// localhost:9090/topic/chenxuan
router.route('/:id')
    .get((req, res, next) => {
        (async () => {
            let topic = await TOPIC.getTOPICById(req.params.id);
            return {
                code: 0,
                topic: topic
            }
        })()
            .then(r => {
                res.json(r);
            })
            .catch(e => {
                next(e);
            })
    })
    .patch((req, res) => {
        (async () => {
            let updata = {};
            if(req.body.title) updata.title = req.body.title;
            if(req.body.content) updata.content = req.body.content;
            let topic = await TOPIC.updateTOPICById((req.params.id), updata);
            return {
                code: 0,
                topic: topic
            }
        })()
            .then(r => {
                res.json(r);
            })
            .catch(e => {
                next(e);
            })
    });

router.route('/:id/reply')
    .post((req, res, next) => {
        (async () => {
            const user = await User.getUserById(req.body.userId);
            let topic = await TOPIC.replyATopic({
                topicId : req.params.id,
                creator:user,
                content :req.body.content
            });
            return {
                code: 0,
                topic: topic
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
