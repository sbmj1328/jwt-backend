var logger = require('morgan');
var express = require('express');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var app = express();


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/users', require('./routes/users'));

const port = process.env.PORT || 6000;

var mongoDB =
  'mongodb+srv://ashwith:ashwith1997@cluster0.1dvgq.mongodb.net/testing?retryWrites=true&w=majority';

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.listen(port, () => {
  console.log('created');
});

module.exports = app;
