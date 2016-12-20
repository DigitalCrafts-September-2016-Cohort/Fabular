var express = require('express');
var bodyParser = require('body-parser');
var _ = require('lodash');
var mongoose = require('mongoose');
var bluebird = require('bluebird');

var app = express();

app.use(express.static('static'));
app.use(bodyParser.json());

// mongoose.connect('mongodb://fabular_ack:fabular1234@ds139448.mlab.com:39448/fabular');
mongoose.connect('mongodb://localhost/fabular');
mongoose.Promise = bluebird;

const Cards = mongoose.model('card',{
  name : String,
  items : [String]
});


app.get('/things',function(request,response){
Cards.find()
  .then(function(obj){
    console.log(obj[0].items);
    response.send(obj);
    })
    .catch(function(err){
      console.log(err.stash);
    });
});

app.listen('3000',function(){
  console.log("Server is running");
});
