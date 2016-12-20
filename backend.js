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
    // let items = obj[0].items;
    // _.shuffle(items);
    // console.log(items);
    response.send(_.shuffle(obj[0].items).slice(0,3));
    })
    .catch(function(err){
      console.log(err.stash);
    });
});

app.listen('3000',function(){
  console.log("Server is running");
});
