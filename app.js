const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const index = require('./routes/index');
const users = require('./routes/user');
const topic = require('./routes/topic');
require('./services/mongogse_service');
const Errors = require('./error');
const logger = require('./util/logger').logger;

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('./middlewares/req_log').logRequests())

app.use('/', index);
app.use('/user', users);
app.use('/topic', topic);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  if (err instanceof Errors.BaseHTTPError) {
    res.statusCode = err.httpCode
    res.json({
      code: err.OPCode,
      error: err.httpMsg
    })
  } else {
    res.statusCode = 500
    res.json({
      code: Errors.BaseHTTPError.DEFAULT_OPCODE,
      error: '服务器出错了，稍后再试~~'
    })
  }
  logger.error('response error to user', err)
});

module.exports = app;
