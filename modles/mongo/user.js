const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');
const bluebird = require('bluebird');
const pbkdf2Async = bluebird.promisify(crypto.pbkdf2);
const SALT = require('../../cipher').PASSWORD_SALT;

const UserSchema = new Schema({
  name: {type: String, required: true},
  age: {type: Number, max: [90, 'over 90 will not use postman']},
  phoneNumber: String,
  password: String,
  avatar: String
});

UserSchema.index({name: 1}, {unique: true});

const UserModel = mongoose.model('user', UserSchema);
//过滤条件 0 表示不显示
const DEFAULT_PROJECTION = {
  password: 0, phoneNumber: 0, __v: 0
};

async function createANewUser(params) {
  const user = new UserModel({name: params.name, age: params.age, phoneNumber: params.phoneNumber});
  user.password = await pbkdf2Async(params.password, SALT, 512, 128, 'sha512')
      .then(r => r.toString())
      .catch(e => {
        console.log(e);
        throw new Error('something gose wrong inside server');
      })
  let creator = await user.save()
      .catch(e => {
        console.log(e)
        switch (e.code) {
          case 11000:
            throw new Error('this name has created , change another!!!!');
            break;
          default:
            throw new Error(`error creating user ${ JSON.stringify(params) }`);
            break;
        }
      });
  return {
    _id: creator._id,
    name: creator.name,
    age: creator.age
  }
}

async function getUsers(params = {page: 0, pageSize: 10}) {
  let flow = UserModel.find({});
  flow.select(DEFAULT_PROJECTION);
  flow.skip(params.page * params.pageSize);
  flow.limit(params.pageSize);
  return await flow
      .catch(e => {
        console.log(e);
        throw new Error('error get user from mongo');
      });
}

async function getUserById(userId) {
  return await UserModel.findOne({_id: userId})
      .select(DEFAULT_PROJECTION)
      .catch(e => {
        console.log(e);
        throw new Error(`error get user from id: ${userId}`);
      });
}

async function updateUserById(userId, update) {
  return await UserModel.findOneAndUpdate({_id: userId}, update, {new: true})
      .catch(e => {
        console.log(e);
        throw new Error(`error update user by id: ${userId}`);
      })
}

async function login(phoneNumber, password) {
  password = await pbkdf2Async(password, SALT, 512, 128, 'sha512')
      .then(r => r.toString())
      .catch(e => {
        console.log(e);
        throw new Error('something gose wrong inside server');
      })
  const user = await UserModel.findOne({phoneNumber: phoneNumber, password: password})
      .catch(e => {
        console.log(`error logging in, phone ${phoneNumber}`, {err: e.stack || e});
        throw new Error('something gose wrong inside server');
      })
  if (!user) throw new Error('No such User');
  return {
    _id: user._id,
    name: user.name,
    age: user.age
  }
}

module.exports = {
  model: UserModel,
  createANewUser,
  getUsers,
  getUserById,
  updateUserById,
  login
}
