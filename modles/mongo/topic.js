const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReplySchema = new Schema({
    creator: Schema.Types.ObjectId,
    content: {type: String}
});
const TopicSchema = new Schema({
    creator: {type: String, required: true},
    title: {type: String},
    content: {type: String},
    replyList: [ReplySchema]
});

TopicSchema.index({title: 1}, {unique: true});

const TopicModel = mongoose.model('topic', TopicSchema);

async function createANewTOPIC(params) {
    const topic = new TopicModel({title: params.title, content: params.content, replyList: params.replyList});
    return await topic.save()
        .catch(e => {
            console.log(e)
            switch (e.code) {
                case 11000:
                    throw new Error('this title has created , change another!!!!');
                    break;
                default:
                    throw new Error(`error creating title ${ JSON.stringify(params) }`);
                    break;
            }
        });
}

async function getTOPICs(params = {page: 0, pageSize: 10}) {
    let flow = TopicModel.find({});
    flow.skip(params.page * params.pageSize);
    flow.limit(params.pageSize);
    return await flow
        .catch(e => {
            console.log(e);
            throw new Error('error get topic from mongo');
        });
}

async function getTOPICById(topicId) {
    return await TopicModel.findOne({_id: topicId})
        .catch(e => {
            console.log(e);
            throw new Error(`error get topic from id: ${topicId}`);
        });
}

async function updateTOPICById(topicId, update) {
    return await TopicModel.findOneAndUpdate({_id: topicId}, update, {new: true})
        .catch(e => {
            console.log(e);
            throw new Error(`error update topic by id: ${topicId}`);
        })
}

async function replyATopic(params) {
    return await TopicModel.findOneAndUpdate({_id: params.topicId},
        {$push: {replyList: {creator: params.creator, content: params.content}}},
        {new: true})
        .catch(e => {
            console.log(e);
            throw new Error(`error replay topic by id: ${topicId}`);
        })
}

module.exports = {
    model: TopicModel,
    createANewTOPIC,
    getTOPICs,
    getTOPICById,
    updateTOPICById,
    replyATopic
}
