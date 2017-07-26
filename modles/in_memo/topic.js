let TOPIC_ID_INIT = 10000,
    topics = [];

class TOPIC {
    constructor(params) {
        if (!params.creator) throw new Error({code: -1, msg: "a topic must send by a user"});
        if (!params.title) throw new Error({code: -1, msg: "a topic must contain a title"});
        if (params.content < 5) throw new Error({code: -1, msg: "a topic's content must longer then 5"});
        this._id = TOPIC_ID_INIT++;
        this.title = params.title;
        this.content = params.content;
        this.replyList = [];
    }
}

async function createANewTOPIC(params) {
    const topic = new TOPIC(params);
    topics.push(topic);
    return topic;
}

async function getTOPICs(params) {
    return topics;
}

async function getTOPICById(topicId) {
    return topics.find(u => u._id === topicId);
}

async function updateTOPICById(topicId, update) {
    const topic = topics.find(u => u._id === topicId);
    if (update.name) topic.name = update.name;
    if (update.age) topic.age = update.age;
}

async function replyATopic(params) {
    const topic = topics.find(t => Number(params.topicId) === t._id);
    topic.replyList.push({
        creator: params.creator,
        content: params.content
    });
    return topic;
}

module.exports = {
    model: TOPIC,
    createANewTOPIC,
    getTOPICs,
    getTOPICById,
    updateTOPICById,
    replyATopic
}
