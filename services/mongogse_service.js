const mongoose = require('mongoose');

const uri = 'mongodb://localhost:27017/one_punch';

mongoose.Promise = global.Promise;

mongoose.connect(uri, {UseMongoClient: true});

db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () {
    console.log('connected!!!!');
})