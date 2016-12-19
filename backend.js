var express = require('express');
var bodyParser = require('body-parser');
var _ = require('lodash');
var mongoose = require('mongoose');
var Promise = require('bluebird');

var app = express();

app.use(express.static('static'));
app.use(bodyParser.json());

mongoose.connect('mongodb://fabular_ack:fabular1234@ds139448.mlab.com:39448/fabular');

var Category = mongoose.model('category',{
  fruits : [String]
});



app.get('/things',function(request,response){
  Category.find()
  .then(function(data){
    console.log("holasdf",data[0]);
    response.json(data[0]);
    })
    .catch(function(err){
      console.log(err.stash);
    });
});

app.listen('3000',function(){
  console.log("Server is running");
});
